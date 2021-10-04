import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(account: Address, id: UInt64): Bool {
    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    return collectionRef.borrowNFT(id: id) != nil
}