import { useEffect, useState } from "react"
import { collectionsService } from "../services/collections"
import { userService } from "../services/users"
import { NETWORK_TYPE } from "../utils/constants"

export type OwnershipFunction = {
  owner?: string,
  ownerType?: string,
  ownerChainId?: number,
  collectionAddress?: string
}

const getNFTOwnership = async (collection_address_map: {[chainId: string]: string}, token_id: string) => {
  let tokenIdOwner = []
  let tokenChainId = 0
  for (const chain_id in collection_address_map) {
    if(Number(chain_id)===4002) continue
    tokenIdOwner = await collectionsService.getNFTOwner(
      collection_address_map[chain_id],
      NETWORK_TYPE[Number(chain_id)],
      token_id
    )

    if (tokenIdOwner?.length > 0) {
      tokenChainId = Number(chain_id)
      break
    }
  }
  
  if (tokenIdOwner?.length > 0) {
    const user_info = await userService.getUserByAddress(tokenIdOwner)
    if(user_info.username == ''){
      return {
        owner: tokenIdOwner as string,
        ownerType: 'address',
        ownerChainId: tokenChainId,
        collectionAddress: collection_address_map[tokenChainId]
      }
    } else {
      return {
        owner: user_info.username as string,
        ownerType: 'username',
        ownerChainId: tokenChainId,
        collectionAddress: collection_address_map[tokenChainId]
      }
    }
  }

  return {
    owner: '',
    ownerType: '',
    ownerChainId: 0,
    collectionAddress: '',
  }
}

const useOwnership = ({
  collection_address_map,
  token_id
}: any): OwnershipFunction => {
  const [ownership, setOwnership] = useState({
    owner: '',
    ownerType: '',
    ownerChainId: 0,
    collectionAddress: '',
  })
  useEffect(() => {
    getNFTOwnership(collection_address_map, token_id).then(data => {
      setOwnership(data)
    })
  }, [collection_address_map, token_id])

  return ownership
}

export default useOwnership
