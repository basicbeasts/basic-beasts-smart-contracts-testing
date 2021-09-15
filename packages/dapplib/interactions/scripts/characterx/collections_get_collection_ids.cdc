import CharacterX from Project.CharacterX

pub fun main(account: Address): [UInt64] {
    
    let acct = getAccount(account)

    let collectionRef = acct.getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()!

    return collectionRef.getIDs()

}