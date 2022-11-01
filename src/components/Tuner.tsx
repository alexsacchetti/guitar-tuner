import React, { useEffect, useRef, useState } from 'react'
import { getTuningInfo, initAudio, initTuner } from '@ddlab/tuner'
import { lookup } from 'dns'
import { motion } from 'framer-motion'

const Tune: React.FC<{}> = (props) => {
  const [displayNote, setDisplayNote] = useState<string>('No Note Yet')
  const [displayCents, setDisplayCents] = useState<number>(0)
  const [displayTune, setDisplayTune] = useState<string>('Not Tuned Yet')
  const [loopId, setLoopId] = useState<any>('')
  const [isTune, setIsTune] = useState<string>('')
  const [isTuning, setIsTuning] = useState<boolean>(false)
  const [deltaState, setDeltaState] = useState<any>()
  const [rotate, setRotate] = useState<any>('')

  const audioShow = useRef(null)

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
        if (isInTune) {
          setIsTune('In Tune!!!')
        } else {
          setIsTune('')
        }
      }
    }
    loop()
  }

  // useEffect(() => {
  //   console.log(isTuning, loopId)
  // }, [isTuning, loopId])

  // const getAudioStream = () => {
  //   console.log('STARRRRRTT GOOO GOOO GOOOO')
  //   initAudioStream()
  // }

  const endAudioStream = () => {
    console.log('ending the audio stream!!!')
    // setIsTuning(false)
    cancelAnimationFrame(loopId)
  }
  // // This is the tuner widget
  //   useEffect(() => {
  //     initCheck()
  //   }, [])
  //   const initCheck = () => {
  //     initTuner(audioShow.current)
  //   }

  return (
    <div>
      <div className="audio" ref={audioShow}></div>
      <div className="container">
        <div className="tuneNote">{displayNote}</div>
        <div className="animate">
          <div>
            <motion.div className="triangle-up" animate={{ rotate }} transition={{ type: 'spring' }} />
          </div>
        </div>
        <div className="tuner">{displayCents} cents</div>
        <div className="tuner">{displayTune}</div>
        <div className="tuner">{isTune}</div>
        <button type="button" onClick={initAudioStream}>
          Start
        </button>
        <button type="button" onClick={endAudioStream}>
          End
        </button>
      </div>
    </div>
  )
}

export default Tune
