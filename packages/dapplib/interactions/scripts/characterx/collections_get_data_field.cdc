//TODO: Write more scripts that get the rest of a character's data. We have more separated data than NBATS' metadata
//in case we don't write getters for each field in contract we might do like setdata script
import CharacterX from Project.CharacterX

pub fun main(account: Address, characterID: UInt64, fieldToSearch: String): String {
    let collectionRef = getAccount(account).getCapability(CharacterX.CollectionPublicPath)
        .borrow<&{CharacterX.CharacterCollectionPublic}>()
        ?? panic("Couldn't get public character collection reference")

    let token = collectionRef.borrowCharacterNFT(id: characterID)
        ?? panic("Couldn't borrow a reference to the specified character")

    let data = token.data

    let field = CharacterX.getCharacterDataByField(characterID: data.characterID, field: fieldToSearch) ?? panic("Character doesn't exist")

    return field
}