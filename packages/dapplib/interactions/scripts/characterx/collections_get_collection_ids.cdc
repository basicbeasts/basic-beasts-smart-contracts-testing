import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(account: Address): [UInt64] {
    
    let acct = getAccount(account)

    let collectionRef = acct.getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()!

    return collectionRef.getIDs()

}