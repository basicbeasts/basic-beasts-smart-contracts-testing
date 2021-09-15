import CharacterX from Project.CharacterX

pub fun main(setName: String): [UInt32] {

    let ids = CharacterX.getSetIDsByName(setName: setName)
        ?? panic("Couldn't find the specified set name")

    return ids

}