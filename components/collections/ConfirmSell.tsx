import React, {useState} from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CustomSelect from './CustomSelect'
import Select from 'react-select'
import { IListingData } from '../../interface/interface'
import { CURRENCIES_LIST, getValidCurrencies } from '../../utils/constants'
import useWallet from '../../hooks/useWallet'
import { ChainIds } from '../../types/enum'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      margin: 0,
    },
    dlgWidth: {
      maxWidth: '800px',
      width: '800px',
      height: '620px'
    }
  }),
)

const period_list = [
  { value: 0, text: '1 Day', period: 1, },
  { value: 1, text: '1 Week', period: 7, },
  { value: 2, text: '1 Month', period: 30, },
  { value: 3, text: '1 Year', period: 365, },
]

interface IConfirmSellProps {
  handleSellDlgClose: () => void,
  openSellDlg: boolean,
  nftImage: string,
  nftTitle: string,
  onSubmit?: (listingData: IListingData) => void
}

const ConfirmSell: React.FC<IConfirmSellProps> = ({
  handleSellDlgClose,
  openSellDlg,
  nftImage,
  nftTitle,
  onSubmit
}) => {
  const classes = useStyles()
  const [sellType, setSellType] = useState('fixed')
  const [price, setPrice] = useState(0)
  const [currency, setCurrency] = useState(CURRENCIES_LIST[0])
  const [period, setPeriod] = useState(period_list[2])
  const { provider } = useWallet()
  const chainId = provider?.network?.chainId || ChainIds.ETHEREUM
  const validCurrencies = getValidCurrencies(chainId)

  const onChangePrice = (e: any) => {
    setPrice(e.target.value)
  }

  const onListing = () => {
    if (onSubmit) {
      onSubmit({
        currencyName: currency.text,
        price,
        period: period.period,
        isAuction: sellType != 'fixed'
      })
    }
  }

  return (
    <Dialog open={openSellDlg} onClose={handleSellDlgClose} aria-labelledby="form-dialog-title" classes={{paper: classes.dlgWidth}}>
      <DialogTitle id="form-dialog-title" className={classes.root}>
        <div className="columns-2 mt-5">
          <div className="text-[#1E1C21] text-[28px] font-semibold">list item for sale</div>
          <div className="flex justify-end">
            <button className={`w-[132px] px-5 py-2 text-[#ADB5BD] font-['Roboto Mono'] font-semibold text-[16px] rounded-[8px] border-2 border-[#ADB5BD] ${sellType=='fixed'?'z-10 bg-[#E9ECEF]':'bg-[#F8F9FA]'}`} onClick={() => setSellType('fixed')}>fixed price</button>
            <button className={`w-[132px] px-5 py-2 text-[#6C757D] font-['Roboto Mono'] font-semibold text-[16px] rounded-[8px] border-2 border-[#ADB5BD] relative -left-2.5 ${sellType=='auction'?'z-10 bg-[#E9ECEF]':'bg-[#F8F9FA]'}`}onClick={() => setSellType('auction')}>auction</button>
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        {
          sellType == 'auction' &&
          <>
            <div className='flex justify-between'>
              <div>
                <p className="text-[#6C757D] text-[18px] font-semibold">Starting Price</p>
                <div className="flex justify-start items-center mt-5">
                  <CustomSelect optionData={validCurrencies} value={currency} onChange={(value: any) => setCurrency(value)} />
                  <input type="text" value={price} className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F6F8FC] border-[2px] border-[#E9ECEF] rounded-lg" onChange={onChangePrice}/>
                  <span className="px-4 text-[#ADB5BD] font-light">~ $40.50 USD</span>
                </div>
                {/* <p className="text-[#6C757D] text-[18px] font-semibold mt-10">Reserve Price</p>
                <div className="flex justify-start items-center mt-5">
                  <CustomSelect optionData={CURRENCIES_LIST} value={currency} onChange={(value: any) => setCurrency(value)} />
                  <input type="text" value="60.00" className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F8F9FA] border-[2px] border-[#E9ECEF] rounded-lg"/>
                  <span className="px-4 text-[#ADB5BD] font-light">~ $60.00 USD</span>
                </div> */}
                <p className="text-[#6C757D] text-[18px] font-semibold mt-10">Duration</p>
                <div className="flex justify-start items-center mt-5">
                  <Select
                    placeholder="Select"
                    styles={{
                      control: (styles:any) => ({ ...styles,
                        borderRadius: '8px',
                        backgroundColor: '#F6F8FC',
                        border: '2px solid #E9ECEF',
                        width: '170px'
                      })
                    }}
                    options={period_list as any}
                    isSearchable={ false }
                    getOptionLabel={(e:any) => e?.text}
                    getOptionValue={(e:any) => e?.value}
                    value={0}
                  />
                  {/* <input type="text" value="60.00" className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F6F8FC] border-[2px] border-[#E9ECEF] rounded-lg"/>
                  <span className="px-4 text-[#ADB5BD] font-light">~ $60.00 USD</span> */}
                </div>
              </div>

              <div>
                <img alt={'nftImage'} className='rounded-[8px] max-w-[250px]' src={nftImage} />
                <p className='mt-2 text-center text-[#6C757D] font-medium'>{nftTitle}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 mt-10 flex items-end">
              <div className="col-span-1">
                <button className='bg-[#B00000] rounded text-[#fff] w-[95px] h-[35px]' onClick={() => onListing()}>list</button>
              </div>
              <div className="col-span-3">
                <div className='flex justify-end'>
                  <p className='text-[12px] text-[#6C757D] font-semibold mr-6'>service fee:</p>
                  <p className='text-[12px] w-[60px] text-[#ADB5BD] font-light'>1.50% *</p>
                </div>
                <div className='flex justify-end'>
                  <p className='text-[12px] text-[#6C757D] font-semibold mr-6'>creator fee:</p>
                  <p className='text-[12px] w-[60px] text-[#ADB5BD] font-light'>2.00%</p>
                </div>
                <div className='flex justify-end'>
                  <p className='text-[12px] mt-1.5 text-[#ADB5BD] font-light italic text-right'>*purchases using $OMNI reduce buyer’s<br/>platform tax from 2% to 1.5%</p>
                </div>
              </div>
            </div>
          </>
        }
        {
          sellType == 'fixed' &&
          <>
            <div className='flex justify-between'>
              <div>
                <p className="text-[#6C757D] text-[18px] font-semibold">Sale Price</p>
                <div className="flex justify-start items-center mt-5">
                  <CustomSelect optionData={validCurrencies} value={currency} onChange={(value: any) => setCurrency(value)} />
                  <input type="text" value={price} className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F6F8FC] border-[2px] border-[#E9ECEF] rounded-lg" onChange={onChangePrice}/>
                </div>
                <p className="text-[#ADB5BD] text-[14px] font-light italic leading-6 w-[435px] mt-10">*sale funds are recieved on the blockchain the NFT is currently hosted on</p>
                <p className="text-[#6C757D] text-[18px] font-semibold mt-10">Duration</p>
                <div className="flex justify-start items-center mt-5">
                  <Select
                    placeholder="Select"
                    styles={{
                      control: (styles:any) => ({ ...styles,
                        borderRadius: '8px',
                        backgroundColor: '#F6F8FC',
                        border: '2px solid #E9ECEF',
                        width: '170px'
                      })
                    }}
                    options={period_list as any}
                    isSearchable={ false }
                    getOptionLabel={(e:any) => e?.text}
                    getOptionValue={(e:any) => e?.value}
                    value={period}
                    onChange={(value: any) => setPeriod(value)}
                  />
                  {/* <input type="text" value="60.00" className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F6F8FC] border-[2px] border-[#E9ECEF] rounded-lg"/>
                  <span className="px-4 text-[#ADB5BD] font-light">~ $60.00 USD</span> */}
                </div>
              </div>
              <div>
                <img alt={'nftImage'} className='rounded-[8px] max-w-[250px]' src={nftImage} />
                <p className='mt-2 text-center text-[#6C757D] font-medium'>{nftTitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 mt-20 flex items-end">
              <div className="col-span-1">
                <button className='bg-[#B00000] rounded text-[#fff] w-[95px] h-[35px]' onClick={() => onListing()}>list</button>
              </div>
              <div className="col-span-3">
                <div className='flex justify-end'>
                  <p className='text-[12px] text-[#6C757D] font-semibold mr-6'>service fee:</p>
                  <p className='text-[12px] w-[60px] text-[#ADB5BD] font-light'>1.50% *</p>
                </div>
                <div className='flex justify-end'>
                  <p className='text-[12px] text-[#6C757D] font-semibold mr-6'>creator fee:</p>
                  <p className='text-[12px] w-[60px] text-[#ADB5BD] font-light'>2.00%</p>
                </div>
                <div className='flex justify-end'>
                  <p className='text-[12px] mt-1.5 text-[#ADB5BD] font-light italic text-right'>*purchases using $OMNI reduce buyer’s<br/>platform tax from 2% to 1.5%</p>
                </div>
              </div>
            </div>
          </>
        }
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmSell
