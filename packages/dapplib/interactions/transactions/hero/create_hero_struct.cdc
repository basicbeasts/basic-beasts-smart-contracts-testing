import Hero from "../../../contracts/Project/Hero.cdc"

transaction(
            name: String, 
            sex: String,
            race: String,
            rarity: String, 
            createdAt: UInt64,
            createdFrom: [UInt64],
            lineages: {String: Bool},
            bloodlines: {String: Bool},
            elements: {String: Bool},
            traits: {String: String}, 
            data: {String: String}
            ) {
    let adminRef: &Hero.Admin
    let currentHeroStructID: UInt32

    prepare(acct: AuthAccount) {
        self.currentHeroStructID = Hero.nextHeroStructID;
        self.adminRef = acctç.borrow<&Hero.Admin>(from: Hero.AdminStoragePath)
            ?? panic("No admin resource in storage")
    }
    execute {
        self.adminRef.createHeroStruct(name: name, 
                                        sex: sex, 
                                        race: race, 
                                        rarity: rarity, 
                                        createdAt: createdAt, 
                                        createdFrom: createdFrom, 
                                        lineages: lineages, 
                                        bloodlines: bloodlines, 
                                        elements: elements, 
                                        traits: traits, 
                                        data: data)
    }

    post {
        Hero.getHeroStruct(heroStructID: currentHeroStructID) != nil:
            "currentHeroStructID doesn't exist"
    
            }