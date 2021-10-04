import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(characterID: UInt32): String {

    let image = CharacterX.getCharacterImage(characterID: characterID)
        ?? panic("Character doesn't exist")

    return image
}