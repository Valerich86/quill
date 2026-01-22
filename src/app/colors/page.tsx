import React from 'react'

export default function Colors() {
  const colorClasses = ['primary', 'light', 'dark', 'accent_1', 'accent_2'];
  return (
    <div className='w-full h-screen flex justify-center items-center gap-10 bg-zinc-400'>
      {colorClasses.map((item, i) => (
        <div key={i}>
          <span>{item}</span>
          <div className={`w-[100px] h-[100px] rounded bg-${item}`}></div>
        </div>
      ))}
    </div>
  )
}
