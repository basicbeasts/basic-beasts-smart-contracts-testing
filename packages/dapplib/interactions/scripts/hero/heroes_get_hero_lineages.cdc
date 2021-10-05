import Hero from "../../../contracts/Project/Hero.cdc"

pub fun main(heroStructID: UInt32): {String: Bool} {

    let lineages = Hero.getHeroLineages(heroStructID: heroStructID)
        ?? panic("Hero doesn't exist")

    return lineages
}
