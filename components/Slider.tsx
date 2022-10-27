import React from 'react'
import Image from 'next/image'
import Loading from '../public/images/loading_f.gif'
import 'swiper/css'
import { IPropsSlider } from '../interface/interface'

const Slider = (props: IPropsSlider) => {
  return (
    <>
      <div className="mt-10 pl-12 pr-20 mb-20">
        <div className="relative w-full mt-20 pr-4 pt-12 ">
          <div
            className={`py-6 text-2xl font-bold underline mb-12 z-10 absolute top-1 ${
              props.title === '' ? 'mt-10' : ''
            }`}
          >
            {props.title}
          </div>

          <div className="py-4 mt-5">
            <div className="w-full flex flex-wrap justify-center gap-12">
              {
                props.cards.length ===0 &&
                <Image src={Loading} alt='Loading...' width='80px' height='80px'/>
              }
              {props.cards.map((item, index) => (
                <div className='w-[340px]' key={index} >
                  {item}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Slider
