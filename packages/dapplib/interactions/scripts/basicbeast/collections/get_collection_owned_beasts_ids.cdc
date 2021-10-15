import BasicBeast from "./../../../contracts/Project/BasicBeast.cdc"

pub fun main(account: Address): [UInt64] {
    
    let acct = getAccount(account)

    let collectionRef = acct.getCapability(BasicBeast.CollectionPublicPath)
        .borrow<&{BasicBeast.BeastCollectionPublic}>()!

    return collectionRef.getIDs()

}