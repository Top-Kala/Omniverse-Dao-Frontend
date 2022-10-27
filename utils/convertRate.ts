export function convertETHtoUSDT(amount:number, rateETH:number){
  return amount*1.0*rateETH
}

export function convertUSDTtoETH(amount:number, rateETH:number){
  return amount*1.0/rateETH
}
