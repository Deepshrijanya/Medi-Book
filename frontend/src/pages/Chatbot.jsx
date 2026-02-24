import React, { useState, useEffect, useRef, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import DoctorCard from '../components/DoctorCard'
import { assets } from '../assets/assets'

const Chatbot = () => {
    const { backendUrl } = useContext(AppContext)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('chatbot_history')
        return saved ? JSON.parse(saved) : [
            {
                role: 'bot',
                content: 'Hello! I am your AI Health Assistant. How can I help you today?',
            },
        ]
    })
    const [loading, setLoading] = useState(false)
    const chatContainerRef = useRef(null)

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, loading])

    // Persist messages to localStorage
    useEffect(() => {
        localStorage.setItem('chatbot_history', JSON.stringify(messages))
    }, [messages])

    const handleClearChat = () => {
        const defaultMsg = [
            {
                role: 'bot',
                content: 'Hello! I am your AI Health Assistant. How can I help you today?',
            },
        ]
        setMessages(defaultMsg)
        localStorage.removeItem('chatbot_history')
        toast.success('Chat history cleared')
    }

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = { role: 'user', content: input }
        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const { data } = await axios.post(backendUrl + '/api/chat', { message: input })

            if (data.success) {
                const botResponse = {
                    role: 'bot',
                    content: data.reply,
                    doctors: data.doctors || [],
                    disclaimer: data.disclaimer,
                    isHealthQuestion: data.isHealthQuestion
                }
                setMessages((prev) => [...prev, botResponse])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to get a response from the AI.')
        } finally {
            setLoading(false)
        }
    }

    // Function to render AI advice with structured sections
    const renderFormattedAdvice = (content) => {
        if (!content) return null;

        // Split content by potential section markers
        const sections = []
        let currentPart = content

        const markers = [
            { id: 'reasons', title: '🔎 Possible Reasons', search: '🔎 Possible Reasons' },
            { id: 'actions', title: '💡 What You Can Do', search: '💡 What You Can Do' },
            { id: 'warning', title: '⚠️ When to See a Doctor', search: '⚠️ When to See a Doctor' }
        ]

        // Simplified parsing logic
        let tempContent = content
        let headerText = ''

        // Find the first marker to extract the header (empathetic opening)
        let firstMarkerIndex = Infinity
        markers.forEach(m => {
            const idx = tempContent.indexOf(m.search)
            if (idx !== -1 && idx < firstMarkerIndex) {
                firstMarkerIndex = idx
            }
        })

        if (firstMarkerIndex !== Infinity) {
            headerText = tempContent.substring(0, firstMarkerIndex).trim()
            tempContent = tempContent.substring(firstMarkerIndex)
        } else {
            headerText = tempContent
            tempContent = ''
        }

        return (
            <div className='space-y-4'>
                {headerText && <p className='text-sm leading-relaxed font-medium text-gray-800'>{headerText}</p>}

                {markers.map((marker, index) => {
                    const startIdx = content.indexOf(marker.search)
                    if (startIdx === -1) return null

                    // Find the end of this section (start of next marker or end of string)
                    let endIdx = content.length
                    markers.forEach(m => {
                        const mIdx = content.indexOf(m.search, startIdx + marker.search.length)
                        if (mIdx !== -1 && mIdx < endIdx) {
                            endIdx = mIdx
                        }
                    })

                    const sectionBody = content.substring(startIdx + marker.search.length, endIdx).trim()

                    return (
                        <div key={marker.id} className='bg-white border border-blue-50 rounded-lg p-3 shadow-sm'>
                            <h3 className='text-sm font-bold text-primary mb-2 flex items-center gap-2'>
                                {marker.title}
                            </h3>
                            <div className='text-xs text-gray-700 leading-relaxed whitespace-pre-line'>
                                {sectionBody}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className='flex flex-col h-[85vh] bg-ivory border border-teal_tint rounded-[20px] overflow-hidden my-6 shadow-2xl'>
            {/* Header */}
            <div className='bg-primary p-5 text-white flex items-center justify-between shadow-md z-10'>
                <div className='flex items-center gap-4'>
                    <div className='w-11 h-11 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                        <img className='w-6 opacity-90' src={assets.logo} alt="" style={{ filter: 'brightness(0) invert(1)' }} />
                    </div>
                    <div>
                        <h2 className='text-xl font-bold tracking-tight'>MediBook AI</h2>
                        <div className='flex items-center gap-2'>
                            <span className='w-2 h-2 bg-accent rounded-full animate-pulse'></span>
                            <p className='text-[11px] font-medium opacity-90 uppercase tracking-widest'>Online Assistant</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleClearChat}
                    className='text-[10px] bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-white border border-white/20 transition-all font-bold uppercase tracking-wider shadow-sm'
                >
                    Reset
                </button>
            </div>

            {/* Messages Area */}
            <div ref={chatContainerRef} className='flex-1 overflow-y-auto p-6 space-y-6 bg-ivory scrollbar-hide'>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-5 rounded-[20px] shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-text_primary border border-teal_tint rounded-tl-none'}`}>

                            {msg.role === 'user' ? (
                                <p className='text-sm leading-relaxed font-medium'>{msg.content}</p>
                            ) : (
                                msg.isHealthQuestion ? renderFormattedAdvice(msg.content) : <p className='text-sm leading-relaxed font-medium'>{msg.content}</p>
                            )}

                            {msg.role === 'bot' && msg.doctors && msg.doctors.length > 0 && (
                                <div className='mt-8 border-t border-teal_tint pt-6'>
                                    <p className='text-xs font-bold uppercase text-primary mb-4 tracking-widest'>Specialist Recommendations</p>
                                    <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
                                        {msg.doctors.map((doc) => (
                                            <div key={doc._id} className='min-w-[180px]'>
                                                <DoctorCard doctor={doc} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {msg.role === 'bot' && msg.disclaimer && (
                                <p className='mt-6 text-[10px] font-medium italic text-text_muted border-t border-teal_tint/50 pt-4 text-center'>
                                    {msg.disclaimer}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className='flex justify-start'>
                        <div className='bg-white px-6 py-5 rounded-[20px] rounded-tl-none shadow-sm border border-teal_tint flex items-center gap-2'>
                            <div className='w-2 h-2 bg-primary rounded-full animate-bounce'></div>
                            <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                            <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className='p-8 border-t border-teal_tint bg-white'>
                <div className='flex gap-4 items-center bg-ivory border border-teal_tint rounded-2xl px-6 shadow-inner focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all'>
                    <input
                        type='text'
                        placeholder='Ask about symptoms or specialists...'
                        className='flex-1 bg-transparent py-5 outline-none text-sm text-text_primary font-medium'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className={`p-3 rounded-xl transition-all ${loading ? 'text-text_muted' : 'bg-primary text-white hover:bg-secondary shadow-md active:scale-95'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
                <p className='text-[10px] font-bold text-text_muted/60 text-center mt-4 uppercase tracking-[2px]'>Premium Health Intelligence</p>
            </div>
        </div>
    )
}

export default Chatbot
