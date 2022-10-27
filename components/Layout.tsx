import { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from './Header'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getUser, selectUpdatingUser, selectUser } from '../redux/reducers/userReducer'
import SideBar from './SideBar'
import useWallet  from '../hooks/useWallet'
import SnackbarComponent from './SnackBar'
import Banner from './Banner'
import Link from 'next/link'
import PriceFeed from './PriceFeed'

type LayoutProps = {
  children?: React.ReactNode
}

const Layout: React.FC = ({ children }: LayoutProps) => {
  const router = useRouter()
  const {
    address,
  } = useWallet()

  const [ menu, setMenu ] = useState('home')
  const updatingUser = useSelector(selectUpdatingUser)

  const [isBlur, setIsBlur] = useState<boolean>(false)
  const [currentSlides, setCurrentSlides] = useState<any>([])
  const user = useSelector(selectUser)

  const [collectionMenu, setCollectionMenu] = useState<boolean>(false)

  const dispatch = useDispatch()

  useEffect(() => {
    if ( address != undefined && !updatingUser ) {
      dispatch(getUser(address) as any)
    }
  }, [address, updatingUser, dispatch])

  useEffect(() => {
    setCollectionMenu(false)
    if ( router.pathname.includes('/collections')) {
      setMenu('collections')
      if ( router.pathname == '/collections' ) {
        setCollectionMenu(true)
      }
    } else if ( router.pathname === '/launchpad' ) {
      setMenu('analytics')
    } else if ( router.pathname === '/' ) {
      setMenu('home')
    } else{
      setMenu('others')
    }
  }, [router.pathname])

  useEffect(()=>{
    setIsBlur(!address)
  }, [address])

  useEffect(() => {
    if ( menu === 'home' && user.banners ) {
      const new_slides:Array<React.ReactNode> = []
      new_slides.push(<img src={process.env.API_URL + (user.banners[0]?user.banners[0]:'default_banner.png')} alt="banner - 1" className={'banner-slider'} />)
      new_slides.push(<img src={process.env.API_URL + (user.banners[1]?user.banners[1]:'default_banner.png')} alt="banner - 2" className={'banner-slider'} />)
      new_slides.push(<img src={process.env.API_URL + (user.banners[2]?user.banners[2]:'default_banner.png')} alt="banner - 3" className={'banner-slider'} />)
      setCurrentSlides(new_slides)
    }
  }, [menu, user.banners])

  useEffect(() => {
    if ( menu === 'collections' ) {
      const new_slides:Array<React.ReactNode> = []
      new_slides.push(<Link href={'/collections/kanpai_pandas'}><a><img src='https://i.seadn.io/gae/DCeuchHOQhwg6mEumI2BhKViz81s0CZYXUXd3tK5lL76cWwDBrNM46NDd3z_5lRrsaPGqub1AMKOi9jqvhxvuQJLc1KVXPFFtvVN6g?auto=format&w=1920' alt="banner - 4" className={'banner-slider'} /></a></Link>)
      new_slides.push(<Link href={'/collections/gregs_eth'}><a><img src='https://i.seadn.io/gcs/files/a80f86bc5cc3ab9984161ca01aa04b6c.png?auto=format&w=1920' alt="banner - 5" className={'banner-slider'} /></a></Link>)
      // new_slides.push(<Link href={'/collections/kanpai_pandas'}><a><img src='https://i.seadn.io/gae/DCeuchHOQhwg6mEumI2BhKViz81s0CZYXUXd3tK5lL76cWwDBrNM46NDd3z_5lRrsaPGqub1AMKOi9jqvhxvuQJLc1KVXPFFtvVN6g?auto=format&w=1920' alt="banner - 4" className={'banner-slider'} /></a></Link>)

      setCurrentSlides(new_slides)
    } else if ( menu === 'home' ) {
      const new_slides:Array<React.ReactNode> = []
      if ( user.banners ) {
        new_slides.push(<img src={process.env.API_URL + (user.banners[0]?user.banners[0]:'default_banner.png')} alt="banner - 1" className={'banner-slider'} />)
        new_slides.push(<img src={process.env.API_URL + (user.banners[1]?user.banners[1]:'default_banner.png')} alt="banner - 2" className={'banner-slider'} />)
        new_slides.push(<img src={process.env.API_URL + (user.banners[2]?user.banners[2]:'default_banner.png')} alt="banner - 3" className={'banner-slider'} />)
        setCurrentSlides(new_slides)
      }
    }
  }, [menu, user.banners])

  return (
    <>
      <Head>
        <title>Omni-X Marketplace</title>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'
        />
      </Head>
      <SnackbarComponent />
      <main className='w-full flex flex-col pr-[70px]'>
        <SideBar />
        <Header menu={menu}/>
        <div className={menu==='home'||(menu==='collections'&&collectionMenu)?'':'hidden'}>
          <Banner slides={currentSlides} blur={isBlur} menu={menu} />
        </div>
        {children}
        <PriceFeed/>

      </main>
    </>
  )
}

export default Layout
