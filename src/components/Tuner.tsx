import React, { memo, useEffect, useRef, useState } from 'react'
import { getTuningInfo, initAudio, initTuner } from '@ddlab/tuner'
import { lookup } from 'dns'
import { motion } from 'framer-motion'
import AudioBars from './AudioBars'

const Tune: React.FC<{}> = (props) => {
  const [displayNote, setDisplayNote] = useState<string>('...')
  const [displayCents, setDisplayCents] = useState<number>(0)
  const [displayTune, setDisplayTune] = useState<string>('Not Tuned Yet')
  const [loopId, setLoopId] = useState<any>('')
  const [isTune, setIsTune] = useState<string>('')
  const [isTuning, setIsTuning] = useState<boolean>(false)
  const [deltaState, setDeltaState] = useState<any>()
  const [rotate, setRotate] = useState<any>('')
  const [isPressed, setIsPressed] = useState(false)

  // const audioShow = useRef(null)

  const initAudioStream = async () => {
    const { getFreqData, deltaFreq } = await initAudio()
    const loop = () => {
      const { noteStr, cents, isInTune } = getTuningInfo(getFreqData(), deltaFreq)

      setLoopId(requestAnimationFrame(loop))
      // setIsTuning(true)
      if (isNaN(cents) || !noteStr || noteStr === '-') {
        setDisplayTune('NO SOUND')
        setDisplayCents(0)
      } else {
        console.log(cents, noteStr)
        setDisplayNote(noteStr)
        setDisplayCents(cents)
        setRotate(cents)
        setDisplayTune(isInTune)
        setIsTuning(true)
        if (isInTune) {
          setIsTune('In Tune!!!')
        } else {
          setIsTune('')
        }
      }
    }
    loop()
  }

  const endAudioStream = () => {
    console.log('ending the audio stream!!!')
    setIsTuning(false)
    cancelAnimationFrame(loopId)
  }

  const toggleAudioStream = () => {
    if (isTuning) {
      endAudioStream()
    } else {
      initAudioStream()
    }
    setIsTuning(!isTuning)
    setIsPressed(!isPressed)
  }

  return (
    <div className="tuner-container">
      <div className="tuner">
        <div className="screen">
          {/* Existing tuner elements */}
          <div className="displayNote">{displayNote}</div>
          <div className="">
            <div className="animate">
              <div>
                <motion.div
                  className={`triangle-up ${isTune ? 'green' : ''}`}
                  initial={{ rotate: 0 }}
                  animate={{ rotate }}
                  transition={{ type: 'spring' }}
                />
              </div>
            </div>
          </div>
          <div>{displayCents}</div>
          <AudioBars isAnimating={isTuning} />
        </div>
        <div
          className={`footswitch ${isPressed ? 'pressed' : ''}`}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
        >
          <button className="button" type="button" onClick={toggleAudioStream}>
            {isTuning ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
    </div>

    // <div>
    //   <div className="frame">
    //     {/* <div className="audio" ref={audioShow}></div> */}
    //     <div className="container">
    // <div className="tuneNote">{displayNote}</div>
    // <div className="tuner-frame">
    //   <div className="animate">
    //     <div>
    //       <motion.div
    //         className={`triangle-up ${isTune ? 'green' : ''}`}
    //         animate={{ rotate }}
    //         transition={{ type: 'spring' }}
    //       />
    //     </div>
    //   </div>
    // </div>
    //       <AudioBars isAnimating={isTuning} />
    //       <div className="tunerInfo">
    //         {displayCents} cents <br></br>
    //         {isTune}
    //       </div>
    // <div className="button-container">
    //   <button className="button" type="button" onClick={initAudioStream}>
    //     Start
    //   </button>
    //   <button className="button" type="button" onClick={endAudioStream}>
    //     Stop
    //   </button>
    // </div>
    //     </div>
    //   </div>
    // </div>
  )
}

export default memo(Tune)
