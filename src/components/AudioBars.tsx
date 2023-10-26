function AudioBars({ isAnimating }: { isAnimating: boolean }) {
  return (
    <div className={`audio-bars ${isAnimating ? 'animating' : ''}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="bar" style={{ animationDelay: `${index * 0.2}s` }} />
      ))}
    </div>
  )
}

export default AudioBars
