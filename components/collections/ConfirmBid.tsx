import React, {useState, useEffect} from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CustomSelect from './CustomSelect'
import Select from 'react-select'
import { IBidData } from '../../interface/interface'
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
      height: '530px'
    }
  }),
)

const period_list = [
  { value: 0, text: '1 Day', period: 1, },
  { value: 1, text: '1 Week', period: 7, },
  { value: 2, text: '1 Month', period: 30, },
  { value: 3, text: '1 Year', period: 365, },
]

interface IConfirmBidProps {
  handleBidDlgClose: () => void,
  openBidDlg: boolean,
  nftImage: string,
  nftTitle: string,
  onSubmit?: (bidData: IBidData) => void
}

const ConfirmBid: React.FC<IConfirmBidProps> = ({
  handleBidDlgClose,
  openBidDlg,
  nftImage,
  nftTitle,
  onSubmit
}) => {
  const classes = useStyles()
  const [price_in_usd, setPriceInUSD] = useState('')
  const [price, setPrice] = useState(0)
  const [currency, setCurrency] = useState(CURRENCIES_LIST[0])
  const [period, setPeriod] = useState(period_list[2])
  const { provider } = useWallet()
  const chainId = provider?.network?.chainId || ChainIds.ETHEREUM
  const validCurrencies = getValidCurrencies(chainId)

  const onChangePrice = (e: any) => {
    setPrice(e.target.value)
  }

  useEffect(() => {
    if ( price >= 0 ) {
      setPriceInUSD(`~ $${price} USD`)
    } else {
      setPriceInUSD('')
    }
  }, [price])

  const onBid = () => {
    if (onSubmit) {
      onSubmit({
        currencyName: currency.text,
        price
      } as any)
    }
  }

  return (
    <Dialog open={openBidDlg} onClose={handleBidDlgClose} aria-labelledby="form-dialog-title" classes={{paper: classes.dlgWidth}}>
      <DialogTitle id="form-dialog-title" className={classes.root}>
        <div className="columns-2 mt-5">
          <div className="text-[#1E1C21] text-[28px] font-semibold">place bid</div>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className='flex justify-between'>
          <div>
            <p className="text-[#6C757D] text-[18px] font-semibold">Bid Price</p>
            <div className="flex justify-start items-center mt-5">
              <CustomSelect optionData={validCurrencies} value={currency} onChange={(value: any) => setCurrency(value)} />
              <input type="text" value={price} className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F6F8FC] border-[2px] border-[#E9ECEF] rounded-lg" onChange={onChangePrice}/>
              <span className="px-4 text-[#ADB5BD] font-light">{price_in_usd}</span>
            </div>
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
                options={period_list}
                isSearchable={ false }
                getOptionLabel={(e:any) => e?.text}
                getOptionValue={(e:any) => e?.value}
                value={period}
                onChange={(value: any) => setPeriod(value)}
              />
            </div>
          </div>
          <div>
            <img alt={'nftimage'} className='rounded-[8px] max-w-[250px]' src={nftImage} />
            <p className='mt-2 text-center text-[#6C757D] font-medium'>{nftTitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 mt-12 flex items-end">
          <div className="col-span-1">
            <button className='bg-[#38B000] rounded text-[#fff] w-[95px] h-[35px]' onClick={() => onBid()}>bid</button>
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
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmBid
