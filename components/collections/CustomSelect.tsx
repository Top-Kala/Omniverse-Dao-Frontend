import React, {} from 'react'
import Select, { components } from 'react-select'

const { Option } = components
const IconOption = (props: any) => (
  <Option {...props}>
    <div className='flex justify-start items-center'>
      <img
        src={`/images/${props.data.icon}`}
        className='mr-[8px] w-[21px]'
        alt={props.data.text}
      />
      {props.data.text}
    </div>
  </Option>
)
const CustomSelectValue = (props: any) => (
  <div className='flex justify-start items-center'>
    <img
      src={`/images/${props.data.icon}`}
      className='mr-[8px] w-[21px]'
      alt={props.data.text}
    />
    {props.data.text}
  </div>
)

interface ICustomSelectProps {
  optionData: any[],
  value: object,
  onChange: any,
}

const CustomSelect: React.FC<ICustomSelectProps> = ({
  optionData,
  value,
  onChange
}) => {
  return (
    <Select
      placeholder="Select"
      styles={{
        control: (styles:any) => ({ ...styles,
          borderRadius: '8px',
          backgroundColor: '#F6F8FC',
          border: '2px solid #E9ECEF',
          width: '170px'
        }),
        valueContainer: (styles:any) => ({ ...styles,
          display: 'flex',
        }),
      }}
      value={value}
      options={optionData}
      isSearchable={ false }
      onChange={onChange}
      components={{ Option: IconOption, SingleValue: CustomSelectValue }}
    />
  )
}

export default CustomSelect
