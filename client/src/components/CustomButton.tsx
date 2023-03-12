import React from 'react'

type customButtonProps = {
    styles?: string,
    title?: string,
    btnType?: any,
    handleClick?: any
}

const CustomButton = ({ btnType, title, handleClick, styles }: customButtonProps) => {



    return (
        <button
            type={btnType}
            className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
            onClick={handleClick}
        >
            {title}
        </button>
    )
}

export default CustomButton;