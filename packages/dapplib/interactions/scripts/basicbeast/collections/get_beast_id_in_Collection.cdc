import BasicBeast from "./../../../contracts/Project/BasicBeast.cdc"

pub fun main(account: Address, id: UInt64): Bool {
    let collectionRef = getAccount(account).getCapability(BasicBeast.CollectionPublicPath)
        .borrow<&{BasicBeast.BeastCollectionPublic}>()
        ?? panic("Couldn't get Public Beast Collection reference")

    return collectionRef.borrowNFT(id: id) != nil
}