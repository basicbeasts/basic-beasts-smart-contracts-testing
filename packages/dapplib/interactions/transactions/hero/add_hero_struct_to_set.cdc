//TODO: Do this for all transactions check flowscan how it is used and whether improvements have been made.

import Hero from "../../../contracts/Project/Hero.cdc"

transaction(setID: UInt32, heroStructID: UInt32) {
    let adminRef: &Hero.Admin

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&Hero.Admin>(from: Hero.AdminStoragePath) 
            ?? panic("Could not borrow a reference to the Admin resource")
    }

    execute {
        let setRef = self.adminRef.borrowSet(setID: setID)

        setRef.addHeroStruct(heroStructID: heroStructID)
    }

    post {
        Hero.getCharactersInSet(setID: setID)!.contains(heroStructID):
            "Set does not contain heroStructID"
    }
}