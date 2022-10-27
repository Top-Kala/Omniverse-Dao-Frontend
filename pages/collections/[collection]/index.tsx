/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, Fragment, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { NextPage } from 'next'
import { Listbox, Transition, Switch } from '@headlessui/react'

import Discord from '../../../public/images/discord.png'
import Twitter from '../../../public/images/twitter.png'
import Web from '../../../public/images/web.png'
import Explorer from '../../../public/images/exp.png'
import Loading from '../../../public/images/loading_f.gif'
import { getCollectionNFTs, selectCollectionNFTs, getCollectionInfo, getRoyalty,selectCollectionInfo, clearCollectionNFTs, selectGetNFTs, selectRoyalty } from '../../../redux/reducers/collectionsReducer'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import NFTBox from '../../../components/collections/NFTBox'
import InfiniteScroll from 'react-infinite-scroll-component'

import LazyLoad from 'react-lazyload'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import Checkbox from '@material-ui/core/Checkbox'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import Chip from '@material-ui/core/Chip'
import classNames from '../../../helpers/classNames'
import editStyle from '../../../styles/collection.module.scss'

import { getOrders, selectOrders, getLastSaleOrders,} from '../../../redux/reducers/ordersReducer'
import { IGetOrderRequest , ICollectionInfoFromLocal} from '../../../interface/interface'
import { getChainInfo, getChainIdFromName } from '../../../utils/constants'
//import { useMoralisWeb3Api, useMoralis } from 'react-moralis'
import useWallet from '../../../hooks/useWallet'
import { getChainNameFromId } from '../../../utils/constants'

const sort_fields = [
  { id: 1, name: 'price: low to high', value: 'price', unavailable: false },
  { id: 2, name: 'price: high to low', value: '-price', unavailable: false },
  { id: 3, name: 'Highest last sale',  value: '-last_sale', unavailable: false},
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accordion: {
      width: '100%',
      boxShadow: 'none',
      '& .MuiAccordionDetails-root': {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '1rem'
      },
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexShrink: 0,
      color: 'rgb(108 117 125)',
      fontWeight: 600,
    },
    frmGroup: {
      width: '100%',
      maxHeight: '320px',
      display: 'block',
      overflowY: 'auto',
      overflowX: 'hidden',
      marginTop: '1rem',
      padding: '1rem',
    },
    frmLabel: {
      width: '100%'
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: '#423e3e26',
      '&:hover': {
        backgroundColor: '#423e3e40',
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: 0,
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
      '&:hover': {
        boxShadow: 'none',
      },
      '&:focus': {
        boxShadow: 'none',
      },
    },
    chipRoot: {
      marginRight: '5px',
      marginTop: '5px'
    }
  }),
)

const Collection: NextPage = () => {
  //const { isInitialized, Moralis } = useMoralis()
  const [currentTab, setCurrentTab] = useState<string>('items')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [expandedMenu, setExpandedMenu] = useState(0)
  const [selected, setSelected] = useState(sort_fields[0])
  const [enabled, setEnabled] = useState(false)
  const [collectionAddress, setCollectionAddress] = useState('')
  //const [collectionChainID, setCollectionChainID] = useState('')
  const [collectionChainName,setCollectionChainName] = useState('')


  // const [nfts,setNFTs] = useState<any>({})

  const [hasMoreNFTs, setHasMoreNFTs] = useState(true)

  const router = useRouter()
  
  const col_url = router.query.collection as string
  const display_per_page = 1000
  const [page, setPage] = useState(0)

  const dispatch = useDispatch()
  const nfts = useSelector(selectCollectionNFTs)

  const collectionInfo = useSelector(selectCollectionInfo)

  const royalty = useSelector(selectRoyalty)
  const orders = useSelector(selectOrders)

  const [imageError, setImageError] = useState(false)
  const classes = useStyles()

  const [searchObj, setSearchObj] = useState<any>({})
  const [filterObj, setFilterObj] = useState<any>({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //const [clearFilter, setClearFilter] = useState(false)

  const [isActiveBuyNow, setIsActiveBuyNow] = useState<boolean>(false)
  const [listNFTs, setListNFTs] = useState<any>([])
  const [collectionInfoFromLocal, setCollectionInfoFromLocal] = useState<ICollectionInfoFromLocal>()

  const [explorerUrl, setExplorerUrl] = useState('')

  //const [contractType, setContractType] = useState('')

  //const [floorPrice] = useState(0)

  const finishedGetting = useSelector(selectGetNFTs)
  const [bInit, setInit] = useState(false)

  const {
    provider,
    signer
  } = useWallet()
  
  //const Web3Api = useMoralisWeb3Api()

  const fetchCollectionMetaData = async() => {
    //const chain = '0x'+Number(collectionChainID).toString(16)
    // const  options = {
    //   chain: chain as any,
    //   address: collectionAddress
    // }
    try{
      //const metaData = await Web3Api.token.getNFTMetadata(options)      
      //setContractType(metaData.contract_type)
    }catch(error){
      console.log(error)
    }
    
  }

  useEffect(() => {
    if(collectionInfo && collectionInfo.address && provider?._network?.chainId) {
      let default_key:any
      let flag = false
      Object.keys(collectionInfo.address).map((key,idx)=>{
        const chainId = (provider?._network?.chainId).toString()        
        if(key===chainId){          
          flag = true
          setCollectionAddress(collectionInfo.address[key])
          //setCollectionChainID(key)
          setCollectionChainName(getChainNameFromId(provider?._network?.chainId))          
        }
        if(idx===0) {
          default_key = key
        }
      })
      if(!flag) {
        setCollectionAddress(collectionInfo.address[default_key])
        //setCollectionChainID(default_key)
        setCollectionChainName(getChainNameFromId(default_key as number))        
      }
    }
  },[collectionInfo,provider?._network])

  useEffect(() => {
    
    if ( col_url && provider?._network) {
      dispatch(getCollectionInfo(col_url) as any)
    }
    if ( col_url && provider?._network) {
      const localData = localStorage.getItem('cards')
      if(localData){
        setCollectionInfoFromLocal((JSON.parse(localData)).find((element: ICollectionInfoFromLocal) => element.col_url===col_url))
      }
      
      setPage(0)
    }
  }, [col_url,provider?._network]) 

  useEffect(()=>{
    if(nfts.length>0){
      const request: IGetOrderRequest = {
        isOrderAsk: true,
        startTime: Math.floor(Date.now() / 1000).toString(),
        endTime: Math.floor(Date.now() / 1000).toString(),
        status: ['VALID'],
        sort: 'NEWEST'
      }
      dispatch(getOrders(request) as any)
      const bidRequest: IGetOrderRequest = {
        isOrderAsk: false,
        status: ['VALID'],
        sort: 'PRICE_ASC'
      }
      dispatch(getOrders(bidRequest) as any)
      const excutedRequest: IGetOrderRequest = {
        status: ['EXECUTED'],
        sort: 'UPDATE_OLDEST'
      }
      dispatch(getLastSaleOrders(excutedRequest) as any)
    }
  },[nfts])

  const onChangeSort = (item: any) => {
    setSelected(item)
    dispatch(clearCollectionNFTs() as any)
    dispatch(getCollectionNFTs(col_url, 0, display_per_page, item.value, searchObj) as any)
    setPage(0)
  }

  useEffect(() => {
    if( (collectionInfo && nfts.length >= collectionInfo.count) || finishedGetting ) {
      setHasMoreNFTs(false)
    }
  }, [nfts, selectGetNFTs])

  useEffect(() => {
    if( collectionChainName && collectionAddress ) {
      const chainStr = collectionChainName
      const chainInfo:any =  getChainInfo(getChainIdFromName(chainStr))
      if(chainInfo){
        const mainUrl =chainInfo?.explorers[0]?.url+'/address/'+collectionAddress
        setExplorerUrl(mainUrl)
      }
    }
  }, [collectionChainName,collectionAddress])

  const initAction = async () => {
    await dispatch(clearCollectionNFTs() as any)
    await setInit(true)
    await setHasMoreNFTs(true)
  }

  useEffect(() => {
    initAction()
    if ( collectionInfo ) {
      dispatch(getCollectionNFTs(col_url, 0, display_per_page, selected.value, searchObj) as any)
      setPage(0)
    }
  }, [searchObj])

  const fetchMoreData = () => {
    if ( !bInit )
      return
    if( collectionInfo && nfts.length >= collectionInfo.count ) {
      setHasMoreNFTs(false)
      return
    }
    setTimeout(() => {
      if ( col_url ) {
        dispatch(getCollectionNFTs(col_url, page + 1, display_per_page, selected.value, searchObj) as any)
        setPage(page + 1)
      }
    }, 500)
  }

  const searchAttrsCheck = (bChecked: boolean, attrKey: string, valueKey: string) => {
    const obj = Array.isArray(searchObj[attrKey]) ? searchObj[attrKey] : []

    if(bChecked) {
      obj.push(valueKey)
    } else {
      const index = obj.indexOf(valueKey, 0)
      if (index > -1) {
        obj.splice(index, 1)
      }
    }
    const newObj = {[attrKey]: obj}
    setSearchObj((prevState: any) => {
      return {...prevState, ...newObj}
    })
    let existFilter = false
    Object.keys(searchObj).map((aKey) => {
      if(searchObj[aKey].length > 0) {
        existFilter = true
      }
    })
    if(bChecked || existFilter) {
      //setClearFilter(true)
    }
  }
  
  const searchFilter = (searchValue: string, attrKey: string) => {
    const newObj = {[attrKey]: searchValue}
    setFilterObj((prevState: any) => {
      return {...prevState, ...newObj}
    })
  }

  const handleFilterBtn = (attrKey: string, item: string) => {
    const obj = searchObj[attrKey]
    const index = obj.indexOf(item, 0)
    if (index > -1) {
      obj.splice(index, 1)
    }
    const newObj = {[attrKey]: obj}
    setSearchObj((prevState: any) => {
      return {...prevState, ...newObj}
    })
  }

  const buyComponet = () => {
    const temp = []
    for(let i = 0;i<listNFTs.length;i++){
      temp.push(
        <NFTBox nft={listNFTs[i]} index={i} key={i}  col_url={col_url}/>
      )
    }
    return temp
  }


  useEffect(()=>{
    if(isActiveBuyNow && collectionInfo && nfts.length>0){
      const temp = []
      for(let i=0;i<nfts.length;i++){
        const collection_address=collectionInfo.address[nfts[i].chain_id].toLowerCase()

        for(let j=0; j<orders.length;j++){  
          if(collection_address==orders[j].collectionAddress&& nfts[i].token_id==orders[j].tokenId){
            temp.push(nfts[i]) 
            break         
          }
        }
      }
      setListNFTs(temp)    
    } 
  },[isActiveBuyNow,collectionInfo,nfts])

  useEffect(()=> {
    if (collectionAddress && collectionChainName) {
      fetchCollectionMetaData()
    }
  }, [collectionChainName])
  
  useEffect(()=>{    
    dispatch(getRoyalty('ERC721', '0x4aA142f1Db95B50dA7ca22267Da557050f9A7Ec9', 5 ,signer) as any)
  },[collectionAddress])
  return (
    <>
      <div className={classNames('w-full', 'mt-20', 'pr-[70px]' ,'pt-[30px]', 'relative', editStyle.collection)}>
        <div className="w-[100%] h-[100%] mt-20">
          <img alt={'bannerImage'} className={classNames(editStyle.bannerImg)} src={collectionInfo&&collectionInfo.banner_image ? collectionInfo.banner_image : ''} />
          <div className={classNames(editStyle.bannerOpacity)} />
        </div>
        <div className="flex space-x-8 items-end ml-[70px]">
          <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="logo" />}>
            <img className="w-[200px] h-[200px]" src={imageError?'/images/omnix_logo_black_1.png':(collectionInfo&&collectionInfo.profile_image ? collectionInfo.profile_image : '/images/omnix_logo_black_1.png')} alt="logo" onError={()=>{setImageError(true)}} data-src={collectionInfo&&collectionInfo.profile_image ? collectionInfo.profile_image : ''} />
          </LazyLoad>
          <div className="flex relative  text-lg font-bold text-center items-center">
            <div className={'select-none inline-block p-4 text-xxl font-extrabold '}>
              {collectionInfo?collectionInfo.name:''}
            </div>
            <div className="w-[30px] h-[30px] bg-[#B444F9] rounded-[30px] flex items-center justify-center">
              <div className=" w-[15px] h-[9px] border-b-[3px] border-l-[3px] border-white -rotate-45 "></div>
            </div>
            { collectionInfo&&collectionInfo.discord?
              <Link href={collectionInfo.discord}>
                <a target="_blank" className="p-2 flex items-center">
                  <Image src={Discord} width={25} height={21} alt='discord' />
                </a>
              </Link>
              :
              <a target="_blank" className="p-2 flex items-center">
                <Image src={Discord} width={25} height={21} alt='discord' />
              </a>
            }
            { collectionInfo&&collectionInfo.twitter?
              <Link href={collectionInfo.twitter}>
                <a target="_blank" className="p-2 flex items-center">
                  <Image src={Twitter} alt='twitter' />
                </a>
              </Link>
              :
              <a target="_blank" className="p-2 flex items-center">
                <Image src={Twitter} alt='twitter' />
              </a>
            }
            { collectionInfo&&collectionInfo.website?
              <Link href={collectionInfo.website}>
                <a target="_blank" className="p-2 flex items-center">
                  <Image src={Web} alt='website' />
                </a>
              </Link>
              :
              <a target="_blank" className="p-2 flex items-center">
                <Image src={Web} alt='website' />
              </a>
            }
            <Link href={explorerUrl}>
              <a target='_blank' className="p-2 flex items-center">
                <Image src={Explorer} alt='website' />
              </a>
            </Link>

          </div>
        </div>
        <div className='w-full  mt-[-100px] border-b-2 border-[#E9ECEF]'>
          <div className="flex">
            <div className="w-[320px] min-w-[320px]"/>
          </div>
          <div className="flex">
            <div className="w-[320px] min-w-[320px]">
            </div>
            <div className="flex w-full justify-between items-end">
              <div className="flex flex-col">
                <ul className="flex relative justify-item-stretch text-lg font-bold text-center">
                  <li
                    className={`select-none inline-block p-4  w-32	 cursor-pointer z-30 ${currentTab === 'items' ? 'text-[#1E1C21] border-b-2 border-black': ' text-[#A0B3CC]'} `}
                    onClick={() => setCurrentTab('items')}>
                    items
                  </li>
                  <li className={'select-none inline-block p-4  w-32	 cursor-pointer  z-20  text-[#A0B3CC]'}>activity</li>
                  <li className={'select-none inline-block p-4  w-32	 cursor-pointer  z-10  text-[#A0B3CC]'}>stats</li>
                </ul>
              </div>

              <ul className="flex space-x-4 relative justify-item-stretch items-end text-md font-bold text-center pb-[5px]">
                <li className="inline-block px-[13px] py-[13px] h-fit flex justify-items-center  z-30 bg-[#E7EDF5] rounded-lg font-extrabold">
                  <span className="mr-[22px] ">Items</span>
                  <span >{collectionInfoFromLocal?collectionInfoFromLocal.itemsCnt:0}</span>           
                </li>
                <li className="inline-block px-[13px] py-[13px] h-fit flex justify-items-center  z-30 bg-[#E7EDF5] rounded-lg font-extrabold">
                  <span className="mr-[22px] ">Owners</span>
                  <span >{collectionInfoFromLocal?collectionInfoFromLocal.ownerCnt:0}</span>           
                </li>
                <li className="inline-block px-[13px] py-[13px] h-fit flex justify-items-center  z-30 bg-[#E7EDF5] rounded-lg font-extrabold">
                  <span className="mr-[22px] ">Listed</span>
                  <span >{collectionInfoFromLocal?collectionInfoFromLocal.orderCnt:0}</span>           
                </li>
                <li className="inline-block px-[13px] py-[13px] h-fit flex justify-items-center  z-30 bg-[#E7EDF5] rounded-lg font-extrabold">
                  <span className="mr-[22px] ">Royalty Fee</span>
                  <span >{royalty}%</span>           
                </li>
                <li className="inline-block px-[13px] py-[13px] h-fit flex flex-col space-y-4 justify-items-center  z-30 bg-[#E7EDF5] rounded-lg font-extrabold">
                  <div className="flex flex-col">
                    <div className="flex justify-start">
                      <span>Volume(Total)</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="mr-[10px] ">0</span>
                      <img src='/svgs/eth_asset.svg' alt='asset'></img>
                    </div>                      
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-start">
                      <span >Volume(7d)</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="mr-[10px] ">0</span>
                      <img src='/svgs/eth_asset.svg' alt='asset'></img>
                    </div>                      
                  </div>                               
                </li>
                <li className="inline-block px-[13px] py-[13px] h-fit flex justify-items-center  z-30 bg-[#E7EDF5] rounded-lg font-extrabold">
                  <div className="flex flex-col space-y-2">
                    <div>
                      <span className="mr-[22px] ">Floor</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <div className="flex flex-row justify-between">
                        <span className="mr-[22px] ">{collectionInfoFromLocal?collectionInfoFromLocal.floorPrice.eth:0}</span>
                        <img src='/svgs/eth_asset.svg' alt='asset'></img>
                      </div>
                      <div className="flex flex-row justify-between">
                        <span className="mr-[22px] ">{collectionInfoFromLocal?collectionInfoFromLocal.floorPrice.usd:0}</span>
                        <img src='/svgs/usd_asset.svg' alt='asset'></img>
                      </div>
                      <div className="flex flex-row justify-between">
                        <span className="mr-[22px] ">{collectionInfoFromLocal?collectionInfoFromLocal.floorPrice.usd:0}</span>
                        <img src='/svgs/omni_asset.svg' alt='asset'></img>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-span-1"></div>
        </div>        
      </div>
      


      <div className="w-full pr-[70px]">
        <div className="flex">
          <div className="w-[320px] min-w-[320px]">
            <ul className='flex flex-col space-y-4'>
              <li className="w-full">
                <div
                  className={`w-full px-4 py-4 text-left text-g-600  font-semibold  ${expandedMenu==1?'active':''}`} 
                >
                  Buy Now
                  <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    onClick={()=>setIsActiveBuyNow(!isActiveBuyNow)}
                    className={`${enabled ? 'bg-[#E9ECEF]' : 'bg-[#E9ECEF]'}
                    pull-right relative inline-flex h-[22px] w-[57px] shrink-0 cursor-pointer rounded-full border-2 border-[#6C757D] transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={`${enabled ? 'translate-x-6' : 'translate-x-px'}
                        pointer-events-none inline-block h-[16px] w-[28px] transform rounded-full bg-[#6C757D] shadow-lg ring-0 transition duration-200 ease-in-out mt-px`}
                    />
                  </Switch>
                </div>
              </li>
              <hr/>
              { collectionInfo && collectionInfo.attrs && Object.keys(collectionInfo.attrs).map((key, idx) => {
                const attrs = collectionInfo.attrs
                return <li className="w-full" key={idx}>
                  <Accordion className={classes.accordion}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classNames(classes.heading,'font-RetniSans') } style={{fontFamily:'RetniSans'}}>{key}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div>
                        <div className={classes.search}>
                          <div className={classes.searchIcon}>
                            <SearchIcon />
                          </div>
                          <InputBase
                            placeholder="Search…"
                            classes={{
                              root: classes.inputRoot,
                              input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(e) => {searchFilter(e.target.value, key)}}
                          />
                        </div>
                        <FormGroup classes={{root:classes.frmGroup}}>
                          {
                            attrs[key].values && Object.keys(attrs[key].values).map((valueKey, valueIndex) => {
                              if(valueKey == 'none') {
                                return null
                              }
                              if(filterObj[key] && !valueKey.includes(filterObj[key].toLowerCase())) {
                                return null
                              }
                              return <FormControlLabel
                                key={valueIndex}
                                classes={{label:classes.frmLabel, root: classes.frmLabel}}
                                control={<Checkbox checked={Array.isArray(searchObj[key]) && searchObj[key].indexOf(attrs[key].values[valueKey][3], 0) > -1} onChange={(e) => {searchAttrsCheck(e.target.checked, key, attrs[key].values[valueKey][3])}} color="default" inputProps={{ 'aria-label': 'checkbox with default color' }} />}
                                label={
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-[#4d5358]">{attrs[key].values[valueKey][3]}</span>
                                    <div className="text-right">
                                      <p className="font-bold text-[#697077]">{attrs[key].values[valueKey][4]}</p>
                                      <p className="text-[11px] text-[#697077]">({attrs[key].values[valueKey][1]}%)</p>
                                    </div>
                                  </div>
                                }
                              />
                            })
                          }
                        </FormGroup>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                  <hr/>
                </li>
              })}
              {/* <li className="w-full">
                <button
                  className={`w-full px-8 py-4 text-left text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-xl ${expandedMenu==1?'active':''}`}
                >
                  Price
                  <span className="pull-right">
                    <i className={`${expandedMenu == 1 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
                  </span>
                </button>
              </li>
              <li className="w-full">
                <button
                  className={`w-full px-8 py-4 text-left text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-xl ${expandedMenu==1?'active':''}`}
                >
                  Blockchain
                  <span className="pull-right">
                    <i className={`${expandedMenu == 1 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
                  </span>
                </button>
              </li>
              <li className="w-full">
                <button
                  className={`w-full px-8 py-4 text-left text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-xl ${expandedMenu==1?'active':''}`}
                >
                  Rarity
                  <span className="pull-right">
                    <i className={`${expandedMenu == 1 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
                  </span>
                </button>
              </li>
              <li className="w-full">
                <button
                  className={`w-full px-8 py-4 text-left text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-xl ${expandedMenu==1?'active':''}`}
                >
                  Attributes
                  <span className="pull-right">
                    <i className={`${expandedMenu == 1 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
                  </span>
                </button>
              </li> */}
            </ul>
          </div>
          <div className="px-12 py-6 border-l-2 border-[#E9ECEF] w-full">
            <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 p-1 gap-4">
              <div className="2xl:col-start-4 xl:col-start-3 lg:col-start-2 md:col-start-1">
                <button className="rounded-lg bg-[#38B000] text-[#F6F8FC] py-2 xl:text-[18px] lg:text-[14px] w-full">make a collection bid</button>
              </div>
              <div className="min-w-[180px] z-10 2xl:col-start-5 xl:col-start-4 lg:col-start-3 md:col-start-2">
                <Listbox value={selected} onChange={onChangeSort}>
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-[#E9ECEF] py-2 pl-3 pr-10 text-lg text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 xl:text-[18px] lg:text-[14px]">
                      <span className="block truncate">{selected.name}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <i className="fa fa-chevron-down"></i>
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#E9ECEF] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {sort_fields.map((sort_item, sortIdx) => (
                          <Listbox.Option
                            key={sortIdx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                              }`
                            }
                            value={sort_item}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                  }`}
                                >
                                  {sort_item.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                    <i className="fa fa-chevron-down w-5"></i>
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>
            <div className="mt-5">

              {
                Object.keys(searchObj).map((attrKey) => {
                  return searchObj[attrKey].map((item: any, index: any) => {
                    return <Chip
                      label={item}
                      onClick={() => handleFilterBtn(attrKey, item)}
                      onDelete={() => handleFilterBtn(attrKey, item)}
                      key={index}
                      classes={{ root: classes.chipRoot }}
                    />
                  })
                })
              }
            </div>
            <div className="mt-10">
              {
                Array.isArray(nfts) &&
                <InfiniteScroll
                  dataLength={nfts.length}
                  next={fetchMoreData}
                  hasMore={hasMoreNFTs}
                  loader={
                    <div className='flex justify-center items-center'>
                      <div className="flex justify-center items-center w-[90%] h-[100px]">
                        {!isActiveBuyNow&&<Image src={Loading} alt='Loading...' width='80px' height='80px'/>}
                      </div>
                    </div>
                  }
                  endMessage={
                    <div></div>
                  }
                >
                  <div className="grid 2xl:grid-cols-5 gap-4 xl:grid-cols-3 md:grid-cols-2 p-1">
                    { !isActiveBuyNow && nfts.map((item, index) => {
                      return (
                        <NFTBox nft={item} index={index} key={index}  col_url={col_url} />
                      )
                    })}
                    { isActiveBuyNow && listNFTs && buyComponet()}
                  </div>
                </InfiniteScroll>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Collection
