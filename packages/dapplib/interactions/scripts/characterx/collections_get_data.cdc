//TODO: Write more scripts that get the rest of a character's data. We have more separated data than NBATS' metadata

import CharacterX from Project.CharacterX

pub fun main(account: Address, id: UInt64): {String: String} {
    
    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: id)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data

    let characterData = CharacterX.getCharacterData(characterID: data.characterID) ?? panic("Character doesn't exist") 

    return characterData
}
