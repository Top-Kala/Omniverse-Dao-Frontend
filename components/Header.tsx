import React, { useState } from 'react'
import Link from 'next/link'
import classNames from '../helpers/classNames'
import useProgress from '../hooks/useProgress'
import useWallet from '../hooks/useWallet'
import { useDispatch } from 'react-redux'
import { openSnackBar } from '../redux/reducers/snackBarReducer'
import ProcessingTransaction from './transaction/ProcessingTransaction'
import { Menu } from '@headlessui/react'
import { getSearchText } from '../redux/reducers/headerReducer'
import { updateRefreshBalance } from '../redux/reducers/userReducer'
import { getOmniInstance } from '../utils/contracts'

type HeaderProps = {
  menu: string
}

type HoverType = {
  hoverMenu: string,
  isHover: boolean
}

const Header = ({ menu }: HeaderProps): JSX.Element => {
  const [hover, setHovering] = useState<HoverType>({
    hoverMenu: menu,
    isHover: false
  })
  const { pending, histories, clearHistories } = useProgress()
  const dispatch = useDispatch()
  const { provider, signer } = useWallet()

  const handleMouseOver = (hoverMenu: string) => {
    setHovering({
      hoverMenu: hoverMenu,
      isHover: true
    })
  }

  const handleMouseOut = () => {
    setHovering({
      hoverMenu: '',
      isHover: false
    })
  }

  const onOmniFaucet = async () => {
    const chainId = provider?.network.chainId as number
    const omni = getOmniInstance(chainId, signer)

    const tx = await omni.mint({ gasLimit: '300000' })
    await tx.wait()

    dispatch(updateRefreshBalance())
    dispatch(openSnackBar({ message: 'You received an 10000 $OMNI soon', status: 'success' }))
  }

  const onClear = () => {
    clearHistories()
  }

  const handleChangeInput = (text: string) => {
    dispatch(getSearchText(text) as any)
  }
  return (
    <>
      <nav className={
        classNames(
          'bg-[#F6F8FC]',
          'border-gray-200',
          'px-2',
          'sm:px-4',
          'py-0',
          'rounded',
          // 'dark:bg-gray-800',
          'z-50',
          'fixed',
          'w-full',
        )}
      >
        <div className='flex flex-wrap items-start'>
          <div className='absolute'>
            <div className='flex'>
              <button className='flex items-center mt-[20px]'>
                <img
                  src={'/images/logo.svg'}
                  className='mr-3 bg-contain'
                  alt="logo"
                  width='50px'
                  height='50px'
                />
              </button>
              <input autoFocus type="text" placeholder='Search' className="flex items-center bg-[#F6F8FC] bg-[url('../public/images/search.png')] bg-contain bg-no-repeat	 w-[248px] h-[40px] mt-[25px] border-0 focus:outline-0 focus:shadow-none focus:ring-offset-0 focus:ring-0 px-[50px]" onChange={e => handleChangeInput(e.target.value)}/>
            </div>
          </div>
          {/* <div className='min-w-[200px]'></div> */}
          <div className='justify-between h-[90px] items-center w-full md:flex md:w-auto mx-auto md:order-2' id='mobile-menu-3'>
            <ul className="flex flex-col justify-between md:flex-row md:space-x-8 md:text-sm md:font-medium" >
              <li className="flex items-center" onMouseOver={() => handleMouseOver('home')} onMouseOut={handleMouseOut}>
                <Link href='/'>
                  <a>
                    <div className="w-[219px] h-[90px] bg-no-repeat bg-center" style={{backgroundImage: `url('/navbar/home${menu == 'home' ? '_active' : ''}.svg')`}}>
                      <div className="relative top-3/4 text-center">
                        <span className={`text-lg  ${hover.isHover && hover.hoverMenu == 'home'?'text-[#000000] font-bold':'text-[#ADB5BD]'} ${hover.isHover && hover.hoverMenu != menu?'':'hidden'} ${menu == 'home' && 'hidden'}`} >HOME</span>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
              <li className="flex items-center" onMouseOver={() => handleMouseOver('collections')} onMouseOut={handleMouseOut}>
                <Link href='/collections'>
                  <a>
                    <div className="w-[219px] h-[90px] bg-no-repeat bg-center" style={{backgroundImage: `url('/navbar/collections${menu == 'collections' ? '_active' : ''}.svg')`}}>
                      <div className="relative top-3/4 text-center">
                        <span className={` text-lg  ${hover.isHover && hover.hoverMenu == 'collections'?'text-[#000000] font-bold':'text-[#ADB5BD]'} ${hover.isHover && hover.hoverMenu != menu?'':'hidden'} ${menu == 'collections' && 'hidden'}` }>MARKET</span>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
              <li className="flex items-center" onMouseOver={() => handleMouseOver('analytics')} onMouseOut={handleMouseOut}>
                <Link href='/launchpad'>
                  <a>
                    <div className="w-[219px] h-[90px] bg-no-repeat bg-center" style={{backgroundImage: `url('/navbar/analytics${menu == 'analytics' ? '_active' : ''}.svg')`}}>
                      <div className="relative top-3/4 text-center">
                        <span className={`text-lg ${hover.isHover && hover.hoverMenu == 'analytics'?'text-[#000000] font-bold':'text-[#ADB5BD]'} ${hover.isHover && hover.hoverMenu != menu?'':'hidden'} {menu == 'analytics' && 'hidden'}`} >LAUNCHPAD</span>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {
            histories.length > 0 &&
              <div className={'absolute right-[250px] h-[90px] flex items-center'}>
                <div className={'relative'}>
                  <Menu>
                    <Menu.Button className={'w-[250px] h-[40px] bg-[#F6F8FC] px-[18px] flex items-center justify-between'} style={{ borderRadius: '20px', border: '1.5px solid #000000'}}>
                      <div className={'flex items-center'}>
                        {pending ? 'processing' : 'last transactions'}
                        {
                          pending
                            ?
                            <img width={24} height={24} src={'/images/omnix_loading.gif'} style={{marginLeft: 10}} alt="nft-image" />
                            :
                            <img width={24} height={24} src={'/images/omnix_logo_black_1.png'} style={{marginLeft: 10}} alt="nft-image" />
                        }
                      </div>
                      <div className={'flex items-center'}>
                        <img width={15} height={15} src={'/images/refresh_round.png'} onClick={onClear} alt="nft-image" />
                        <img width={10} height={6} src={'/images/arrowDown.png'} style={{marginLeft: 10}} alt="nft-image" />
                      </div>
                    </Menu.Button>

                    <Menu.Items className={'absolute top-0 w-[250px] bg-white'} style={{ borderRadius: '20px', border: '1.5px solid #000000'}}>
                      <div className={'h-[38px] bg-[#F6F8FC] px-[18px] flex items-center justify-between'} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px'}}>
                        <div className={'flex items-center'}>
                          {pending ? 'processing' : 'last transactions'}
                          {
                            pending
                              ?
                              <img width={24} height={24} src={'/images/omnix_loading.gif'} style={{marginLeft: 10}} alt="nft-image" />
                              :
                              <img width={24} height={24} src={'/images/omnix_logo_black_1.png'} style={{marginLeft: 10}} alt="nft-image" />
                          }
                        </div>
                        <div className={'flex items-center'}>
                          <img width={10} height={6} src={'/images/arrowUp.png'} alt="nft-image" />
                        </div>
                      </div>
                      {
                        histories?.map((item, index) => {
                          return (
                            <Menu.Item key={index}>
                              <ProcessingTransaction txInfo={item} />
                            </Menu.Item>
                          )
                        })
                      }
                    </Menu.Items>
                  </Menu>
                </div>
              </div>
          }

          <div className='absolute right-[100px] top-[20px]'>
            <button className='bg-gradient-to-br from-[#F3F9FF] to-[#DBE1E9] border-2 border-[#A0B3CC] rounded-lg text-black text-lg p-[10px]' onClick={() => onOmniFaucet()}>Get Test OMNI</button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header
