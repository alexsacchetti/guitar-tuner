import React, { useEffect, useRef, useState } from 'react'
import { getTuningInfo, initAudio, initTuner } from '@ddlab/tuner'

const Tune: React.FC<{}> = (props) => {
  const [displayNote, setDisplayNote] = useState<string>('No Note Yet')
  const [displayCents, setDisplayCents] = useState<string>('No Note Yet')
  const [displayTune, setDisplayTune] = useState<string>('No Note Yet')

  const audioShow = useRef(null)

  useEffect(() => {
    initCheck()
  }, [])

  const initAudioStream = async () => {
    const { getFreqData, deltaFreq } = await initAudio()
    const loop = () => {
      const { noteStr, cents, isInTune } = getTuningInfo(getFreqData(), deltaFreq)

      setDisplayNote(noteStr)
      setDisplayCents(cents)
      setDisplayTune(isInTune)

      if (!isInTune) {
        console.log(`My ${noteStr} note is this many cents: ${cents} out of tune. ${isInTune}`)
      }
      requestAnimationFrame(loop)
    }
    loop()
  }

  const initCheck = () => {
    initTuner(audioShow.current)
  }

  return (
    <div>
      <div className="audio" ref={audioShow}></div>
      <div>{displayNote}</div>
      <div>{displayCents}</div>
      <div>{displayTune}</div>
      <button onClick={initAudioStream}>Click</button>
    </div>
  )
}

export default Tune
