import BasicBeast from "./../../../contracts/Project/BasicBeast.cdc"

transaction(
            dexNumber: UInt32,
            name: String, 
            image: String,
            description: String,
            rarity: String,
            skin: String,
            starLevel: UInt32,
            asexual: Bool,
            ultimateSkill: String,
            basicSkills: [String],
            elements: {String: Bool},
            data: {String: String}
    ) {
    let adminRef: &BasicBeast.Admin
    let currentBeastTemplateID: UInt32

    prepare(acct: AuthAccount) {
        self.currentBeastTemplateID = BasicBeast.nextBeastTemplateID;
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)
            ?? panic("No admin resource in storage")
    }
    execute {
        self.adminRef.createBeastTemplate(
                                        dexNumber: dexNumber,
                                        name: name, 
                                        image: image,
                                        description: description,
                                        rarity: rarity,
                                        skin: skin,
                                        starLevel: starLevel,
                                        asexual: asexual,
                                        ultimateSkill: ultimateSkill,
                                        basicSkills: basicSkills,
                                        elements: elements,
                                        data: data
        )
    }

    post {
        BasicBeast.getBeastTemplate(beastTemplateID: self.currentBeastTemplateID) != nil:
            "BeastTemplate doesn't exist"
    }
            }