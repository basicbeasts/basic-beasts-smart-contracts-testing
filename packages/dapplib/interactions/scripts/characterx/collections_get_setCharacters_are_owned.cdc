import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(account: Address, setIDs: [UInt32], characterIDs: [UInt32]): Bool {
    assert(setIDs.length == characterIDs.length, 
    message: "set and character ID arrays have mismatched lengths"
    )

    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let characterNFTIDs = collectionRef.getIDs()

    var i = 0

    while i < setIDs.length {
        var hasMatchingCharacter = false
        for characterID in characterNFTIDs {
            let token = collectionRef.borrowCharacterNFT(id: characterID)
                ?? panic("Couldn't borrow a reference to the specified character")

            let characterData = token.data
            if characterData.setID == setIDs[i] && characterData.characterID == characterIDs[i] {
                hasMatchingCharacter = true
                break
            }
        }
        if !hasMatchingCharacter {
            return false
        }
        i = i + 1
    }

    return true
}
