import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(characterID: UInt32): String {

    let race = CharacterX.getCharacterRace(characterID: characterID)
        ?? panic("Character doesn't exist")

    return race
}