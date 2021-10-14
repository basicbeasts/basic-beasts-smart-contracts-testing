import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(account: Address, id: UInt64): UInt32 {

    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: id)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data
    
    return data.serialNumber
}