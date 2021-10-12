/*
        BasicBeast.cdc

        Description: Central Smart Contract for BasicBeasts  NFT

        Authors: bz bz.vanity@gmail.com

        This smart contract contains the core functionality for 
        the Basic Beasts.

        When a new Beast wants to be added to the records, an Admin creates
        a new BeastTemplate that is stored in the smart contract.

        Then an Admin can create new Sets. Sets consist of a public struct that 
        contains public information about a Set, and a private resource used 
        to mint new beasts based on BeastTemplates that have been linked to the Set

        The admin resource has the power to do all of the important actions
        in the smart contract and Sets. When they want to call functions in a Set,
        they call their borrowSet function to get a reference
        to a Set in the contract.
        Then they can call functions on the Set using that reference.

        In this way, the smart contract and its defined resources interact.

        When Beasts are minted, they are initialized with a BeastData struct and 
        are returned by the minter.

        The contract also defines a Collection resource. This is an object that
        every Beast NFT owner will store in their account
        to manage their NFT Collection.

        The admin Beast account will also have its own Beast Collection that it can 
        use to hold its own Beasts that have not yet been sent to a user.

        Note: All state-changing functions will panic if an invalid argument is 
        provided or one of its pre-conditions or post-conditions aren't met.
        Functions that don't modify state will simply return 0 or nil
        and those cases need to be handled by the caller.

        To my second-most favorite brother (at the time of writing), this one is for you. L.O.L.

        Special thanks to: 
        Jacob, Gel, Morgan, and the rest of the Decentology team for teaching us how to write cadence and build Dapps.
        Josh, Dieter, and the rest of the Flow and Dapper Labs team for making TopShot and Flow Blockchain great and available to everyone.
        You are the best partners, teachers, mentors, and friends one could ever ask for.

*/

import NonFungibleToken from "../Flow/NonFungibleToken.cdc"

pub contract BasicBeast: NonFungibleToken {

    // -----------------------------------------------------------------------
    // BasicBeast contract-level Events
    // -----------------------------------------------------------------------

    // Emitted when the contract is created
    pub event ContractInitialized()

    // Events for Set-related actions
    //
    // Emitted when a new Set is created
    pub event SetCreated(setID: UInt32, generation: UInt32)
    // Emitted when a new BeastTemplate is added to a Set
    pub event BeastTemplateAddedToSet(setID: UInt32, beastTemplateID: UInt32)
    // Emitted when a BeastTemplate is retired from a Set and cannot be used to mint
    pub event BeastTemplateRetiredFromSet(setID: UInt32, beastTemplateID: UInt32, numBeasts: UInt32)
    // Emitted when a Set is locked, meaning BeastTemplates cannot be added
    pub event SetLocked(setID: UInt32)
    // Emitted when a Beast is minted from a Set
    pub event BeastMinted(beastID: UInt64, beastTemplate: BeastTemplate, setID: UInt32, serialNumber: UInt32)

    // Events for Beast-related actions
    //
    // Emitted when a beneficiary has been set to a Beast
    pub event BeastBeneficiaryIsSet(id: UInt64, beneficiary: Address?)
    // Emitted when a Beast is destroyed
    pub event BeastDestroyed(id: UInt64)

    // Events for Admin-related actions
    //
    // Emitted when a new BeastTemplate is created
    pub event BeastTemplateCreated(
                                    id: UInt32, 
                                    dexNumber: UInt32,
                                    name: String, 
                                    image: String,
                                    description: String,
                                    sex: String,
                                    rarity: String,
                                    skin: String,
                                    starLevel: UInt32,
                                    ultimateSkill: String,
                                    basicSkills: [String],
                                    elements: {String: Bool},
                                    data: {String: String}
                                   )
    // Emitted when a new generation has been triggered by an admin
    pub event NewGenerationStarted(newCurrentGeneration: UInt32)
    // Emitted when a new key-value-pair of BeastTemplate's data has been added
    pub event NewBeastTemplateDataFieldAdded(beastTemplateID: UInt32, key: String, value: String)
    // Emitted when a key of a BeastTemplate's data has been removed
    pub event BeastTemplateDataFieldRemoved(beastTemplateID: UInt32, key: String)
    
    // Events for Collection-related actions
    //
    // Emitted when a Beast is withdrawn from a Collection
    pub event Withdraw(id: UInt64, from: Address?)
    // Emitted when a Beast is deposited into a Collection
    pub event Deposit(id: UInt64, to: Address?)

    // -----------------------------------------------------------------------
    // BasicBeast contract-level Named Paths
    // -----------------------------------------------------------------------
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let AdminStoragePath: StoragePath

    // -----------------------------------------------------------------------
    // Beast contract-level fields.
    // These contain actual values that are stored in the smart contract.
    // -----------------------------------------------------------------------

    // Generation that this Set belongs to.
    // Generation is a concept that indicates a group of Sets through time.
    // Many Sets can exist at a time, but only one generation.
    pub var currentGeneration: UInt32

    // Variable size dictionary of Beast structs
    access(self) var beastTemplates: {UInt32: BeastTemplate}

    // Variable size dictionary of Set resources
    access(self) var sets: @{UInt32: Set}

    // The ID that is used to create BeastTemplates.
    // Every time a BeastTemplate is created, beastTemplateID is assigned
    // to the new BeastTemplate's ID and then is incremented by 1.
    pub var nextBeastTemplateID: UInt32

    // The ID that is used to create Sets. Every time a Set is created
    // setID is assigned to the new set's ID and then is incremented by 1.
    pub var nextSetID: UInt32

    // The total number of Beast NFTs that have been created
    // Because NFTs can be destroyed, it doesn't necessarily mean that this
    // reflects the total number of NFTs in existence, just the number that
    // have been minted to date. Also used as global beast IDs for minting.
    pub var totalSupply: UInt64

    // -----------------------------------------------------------------------
    // The Basic Beast contract-level Composite Type definitions
    // -----------------------------------------------------------------------
    // These are just *definitions* for Types that this contract
    // and other accounts can use. These definitions do not contain
    // actual stored values, but an instance (or object) of one of these Types
    // can be created by this contract that contains stored values.
    // -----------------------------------------------------------------------

    // BeastTemplate holds metadata associated with a specific Beast.
    //
    // Beast NFTs will all reference a single BeastTemplate as the owner of
    // its metadata. The BeastTemplates are publicly accessible, so anyone can
    // read the metadata associated with a specific BeastTemplate ID
    //
    pub struct BeastTemplate { 

        // The unique ID for the BeastTemplate
        pub let beastTemplateID: UInt32

        // The BeastTemplate's dex number
        pub let dexNumber: UInt32

        // The BeastTemplate's name
        pub let name: String

        // The BeastTemplate's image URL
        pub let image: String

        // The BeastTemplate's description
        pub let description: String

        // The BeastTemplate's sex
        pub let sex: String

        // The BeastTemplate's rarity
        // e.g. "Common" or "Legendary"
        pub let rarity: String

        // The BeastTemplate's skin
        // e.g. "Normal", "Cursed Black", "Shiny Gold", "Mythic Diamond"
        pub let skin: String

        // The BeastTemplate's star level
        // 1 is low, 3 is high
        pub let starLevel: UInt32

        // The BeastTemplate's ultimate skill
        pub let ultimateSkill: String

        // The BeastTemplate's basic skills
        pub let basicSkills: [String]

        // A dictionary of the BeastTemplate's elements.
        // e.g. does the BeastTemplate have fire or water as its elements?
        pub let elements: {String: Bool}

        // A string mapping of all other BeastTemplate metadata
        pub let data: {String: String}

        init(
            dexNumber: UInt32,
            name: String, 
            image: String,
            description: String,
            sex: String,
            rarity: String,
            skin: String,
            starLevel: UInt32,
            ultimateSkill: String,
            basicSkills: [String],
            elements: {String: Bool},
            data: {String: String}
        ) {
            pre {
                dexNumber != nil: "New BeastTemplate dex number cannot be blank"
                name != "": "New BeastTemplate name cannot be blank"
                image != "": "New BeastTemplate image cannot be blank"
                description != "": "New BeastTemplate race cannot be blank"
                sex != "": "New BeastTemplate must have sex"
                rarity != "": "New BeastTemplate rarity must be determined"
                starLevel != nil: "New BeastTemplate star level cannot be blank"
                ultimateSkill != "": "New BeastTemplate ultimate skill cannot be blank"
                basicSkills.length != 0: "New BeastTemplate basic skills cannot be empty"
                elements.length != 0: "New BeastTemplate element cannot be empty"
                data.length != 0: "New BeastTemplate data cannot be empty"
            }
            self.beastTemplateID = BasicBeast.nextBeastTemplateID 
            self.dexNumber = dexNumber
            self.name = name
            self.image = image
            self.description = description
            self.sex = sex
            self.rarity = rarity
            self.skin = skin
            self.starLevel = starLevel
            self.ultimateSkill = ultimateSkill
            self.basicSkills = basicSkills
            self.elements = elements
            self.data = data

            // Increment the ID so that it isn't used again
            BasicBeast.nextBeastTemplateID = BasicBeast.nextBeastTemplateID + 1 as UInt32

            emit BeastTemplateCreated(
                                    id: self.beastTemplateID, 
                                    dexNumber: self.dexNumber,
                                    name: self.name, 
                                    image: self.image,
                                    description: self.description,
                                    sex: self.sex,
                                    rarity: self.rarity,
                                    skin: self.skin,
                                    starLevel: self.starLevel,
                                    ultimateSkill: self.ultimateSkill,
                                    basicSkills: self.basicSkills,
                                    elements: self.elements,
                                    data: self.data
                                    )
        }
    }

    // A Set is a grouping of BeastTemplates. A BeastTemplate can exist in multiple different sets.
    // 
    // SetData is a struct that is used so anyone can easily 
    // query information about a Set by calling various getters located 
    // at the end of the contract. Only the admin has the ability 
    // to modify any data in the private Set resource.
    //
    pub struct SetData {

        // Unique ID for the Set
        pub let setID: UInt32

        // Name of the Set
        pub let name: String

        // Generation that this Set belongs to.
        // Generation is a concept that indicates a group of Sets through time.
        // Many Sets can exist at a time, but only one generation.
        pub let generation: UInt32

        // Array of BeastTemplates that are a part of this Set.
        // When a BeastTemplate is added to the Set, its ID gets appended here.
        // The ID does not get removed from this array when a BeastTemplate is retired.
        pub var beastTemplatesInSet: [UInt32]

        // Map of beastTemplateIDs that indicates if a BeastTemplate in this Set can be minted.
        // When a BeastTemplate is added to a Set, it is mapped to false (not retired).
        // When a BeastTemplate is retired, this is set to true and cannot be changed.
        pub var retired: {UInt32: Bool}

        // Indicates if the Set is currently locked.
        // When a Set is created, it is unlocked 
        // and BeastTemplates are allowed to be added to it.
        // When a set is locked, BeastTemplates cannot be added.
        // A Set can never be changed from locked to unlocked,
        // the decision to lock a Set is final.
        // If a Set is locked, BeastTemplates cannot be added, but
        // Beasts can still be minted from BeastTemplates
        // that exist in the Set.
        pub var locked: Bool

        // Mapping of beastTemplateIDs that indicates the number of Beasts 
        // that have been minted for specific BeastTemplates in this Set.
        // When a Beast is minted, this value is stored in the Beast to
        // show its place in the Set, eg. 13 of 60.
        pub var numOfMintedPerBeastTemplate: {UInt32: UInt32}

        init(setID: UInt32) {
            pre {
                setID != nil: "setID cannot be empty"
            }

            let set = &BasicBeast.sets[setID] as &Set

            self.setID = set.setID
            self.name = set.name
            self.generation = set.generation
            self.beastTemplatesInSet = set.beastTemplatesInSet
            self.retired = set.retired
            self.locked = set.locked
            self.numOfMintedPerBeastTemplate = set.numOfMintedPerBeastTemplate
        }
    }
    
    // Set is a resource type that contains the functions to add and remove
    // BeastTemplates from a Set and mint Beasts.
    //
    // It is stored in a private field in the contract so that
    // the admin resource can call its methods.
    //
    // The admin can add BeastTemplates to a Set so that the set can mint Beasts
    // that reference that BeastTemplate.
    // The Beasts that are minted by a Set will be listed as belonging to
    // the Set that minted it, as well as the BeastTemplate it references.
    // 
    // Admin can also retire BeastTemplates from the Set, meaning that the retired
    // BeastTemplate can no longer have Beasts minted from it.
    //
    // If the admin locks the Set, no more BeastTemplates can be added to it, but 
    // Beasts can still be minted.
    //
    // If retireAll() and lock() are called back-to-back, 
    // the Set is closed off forever and nothing more can be done with it.
    pub resource Set {

        // Unique ID for the Set
        pub let setID: UInt32

        // Name of the Set
        pub let name: String

        // Generation that this Set belongs to.
        // Generation is a concept that indicates a group of Sets through time.
        // Many Sets can exist at a time, but only one generation.
        pub let generation: UInt32

        // Array of BeastTemplates that are a part of this Set.
        // When a BeastTemplate is added to the Set, its ID gets appended here.
        // The ID does not get removed from this array when a BeastTemplate is retired.
        access(contract) var beastTemplatesInSet: [UInt32]

        // Map of beastTemplateIDs that indicates if a BeastTemplate in this Set can be minted.
        // When a BeastTemplate is added to a Set, it is mapped to false (not retired).
        // When a BeastTemplate is retired, this is set to true and cannot be changed.
        access(contract) var retired: {UInt32: Bool}

        // Indicates if the Set is currently locked.
        // When a Set is created, it is unlocked 
        // and BeastTemplates are allowed to be added to it.
        // When a set is locked, BeastTemplates cannot be added.
        // A Set can never be changed from locked to unlocked,
        // the decision to lock a Set is final.
        // If a Set is locked, BeastTemplates cannot be added, but
        // Beasts can still be minted from BeastTemplates
        // that exist in the Set.
        access(contract) var locked: Bool

        // Mapping of beastTemplateIDs that indicates the number of Beasts 
        // that have been minted for specific BeastTemplates in this Set.
        // When a Beast is minted, this value is stored in the Beast to
        // show its place in the Set, eg. 13 of 60.
        access(contract) var numOfMintedPerBeastTemplate: {UInt32: UInt32}

        init(name: String) {
            self.setID = BasicBeast.nextSetID
            self.name = name
            self.generation = BasicBeast.currentGeneration
            self.beastTemplatesInSet = []
            self.retired = {}
            self.locked = false
            self.numOfMintedPerBeastTemplate = {}

            // Increment the ID so that it isn't used again
            BasicBeast.nextSetID = BasicBeast.nextSetID + 1 as UInt32

            emit SetCreated(setID: self.setID, generation: self.generation)
        }

        // addBeastTemplate adds a BeastTemplate to the Set
        //
        // Parameters: beastTemplateID: The ID of the BeastTemplate that is being added
        //
        // Pre-Conditions:
        // The BeastTemplate needs to be an existing BeastTemplate
        // The Set must not be locked
        // The BeastTemplate can't have already been added to the Set
        //
        pub fun addBeastTemplate(beastTemplateID: UInt32) {
            pre {
                BasicBeast.beastTemplates[beastTemplateID] != nil: "Cannot add the BeastTemplate to Set: The BeastTemplate doesn't exist."
                !self.locked: "Cannot add the BeastTemplate to the Set: The Set is locked."
                self.numOfMintedPerBeastTemplate[beastTemplateID] == nil: "The BeastTemplate has already been added to the Set." 
            }

            // Add the BeastTemplate to the array of beastTemplatesInSet
            self.beastTemplatesInSet.append(beastTemplateID)

            // Open the BeastTemplate up for minting
            self.retired[beastTemplateID] = false

            // Initialize the Beast minted count for this BeastTemplate to zero
            self.numOfMintedPerBeastTemplate[beastTemplateID] = 0

            emit BeastTemplateAddedToSet(setID: self.setID, beastTemplateID: beastTemplateID)
        }

        // addBeastTemplates adds multiple BeastTemplates to the Set
        //
        // Parameters: beastTemplateIDs: The IDs of the BeastTemplates that are being added
        //                      as an array
        //
        pub fun addBeastTemplates(beastTemplateIDs: [UInt32]) {
            for beastTemplate in beastTemplateIDs {
                self.addBeastTemplate(beastTemplateID: beastTemplate)
            }
        }

        // retireBeastTemplate retires a BeastTemplate from the Set so that it can't mint new Beasts
        //
        // Parameters: beastTemplateID: The ID of the BeastTemplate that is being retired
        //
        // Pre-Conditions:
        // The BeastTemplate is part of the Set and not retired (available for minting).
        // 
        pub fun retireBeastTemplate(beastTemplateID: UInt32) {
            pre {
                self.retired[beastTemplateID] != nil: "Cannot retire the BeastTemplate: The BeastTemplate doesn't exist in the Set."
            }

            if !self.retired[beastTemplateID]! {
                self.retired[beastTemplateID] = true

                 emit BeastTemplateRetiredFromSet(setID: self.setID, beastTemplateID: beastTemplateID, numBeasts: self.numOfMintedPerBeastTemplate[beastTemplateID]!)
            }
        }

        // retireAll retires all the BeastTemplates in the Set
        // Afterwards, none of the retired BeastTemplates will be able to mint new Beasts
        //
        pub fun retireAllBeastTemplates() {
            for beastTemplate in self.beastTemplatesInSet { 
                self.retireBeastTemplate(beastTemplateID: beastTemplate) 
            }
        }

        // lock() locks the Set so that no more BeastTemplates can be added to it
        //
        // Pre-Conditions:
        // The Set should not be locked
        pub fun lock() {
            if !self.locked {
                self.locked = true
                emit SetLocked(setID: self.setID)
            }
        }
        
        // mintBeast mints a new Beast and returns the newly minted Beast
        // 
        // Parameters: beastTemplateID: The ID of the BeastTemplate that the Beast references
        //             bornAt: A unix timestamp of when this beast came into existence
        //             matron: The beast ID of the matron of this beast. Set as 0 for genesis
        //             sire: The beast ID of the sire of this beast. Set as 0 for genesis
        //             evolvedFrom: The beast IDs of the beasts this beast is evolved from.
        //                          Set as 0 for genesis or special beasts
        //
        // Pre-Conditions:
        // The Beast must exist in the Set and be allowed to mint new Beasts
        //
        // Returns: The NFT that was minted
        // 
        pub fun mintBeast(
                            beastTemplate: BeastTemplate, 
                            bornAt: UInt64, 
                            matron: UInt64, 
                            sire: UInt64, 
                            evolvedFrom: [UInt64]
            ): @NFT {
            pre {
                self.retired[beastTemplate.beastTemplateID] != nil: "Cannot mint the Beast: This BeastTemplate doesn't exist in this set."
                !self.retired[beastTemplate.beastTemplateID]!: "Cannot mint the Beast from this BeastTemplate: This BeastTemplate has been retired in this set."
            }

            // Gets the number of Beasts that have been minted for this BeastTemplate
            // to use as this BeastTemplates's serial number
            let numInBeastTemplate = self.numOfMintedPerBeastTemplate[beastTemplate.beastTemplateID]!

            // Mint the new Beast
            let newBeast: @NFT <- create NFT(
                                            evolvedFrom: evolvedFrom,
                                            sire: sire,
                                            matron: matron,
                                            bornAt: bornAt,
                                            serialNumber: numInBeastTemplate + 1 as UInt32, 
                                            beastTemplate: beastTemplate, 
                                            setID: self.setID,
            )

            // Increment the count of Beasts minted for this BeastTemplate
            self.numOfMintedPerBeastTemplate[beastTemplate.beastTemplateID] = numInBeastTemplate + 1 as UInt32

            return <-newBeast
        }
        
        // batchMintBeast mints a specified quantity of a 
        // single referenced BeastTemplate and returns them as a Collection
        // when the same BeastTemplate is being minted in a batch all minted beasts
        // will have the same bornAt, matron, sire, and evolvedFrom data
        //
        // Parameters: beastTemplateID: the ID of the BeastTemplate that the Beasts are minted for
        //             bornAt: A unix timestamp of when this beast came into existence
        //             matron: The beast ID of the matron of this beast. Set as 0 for genesis
        //             sire: The beast ID of the sire of this beast. Set as 0 for genesis
        //             evolvedFrom: The beast IDs of the beasts this beast is evolved from.
        //                          Set as 0 for genesis or special beasts
        //             quantity: The quantity of the BeastTemplate to be minted
        //
        // Returns: Collection object that contains all the Beasts that were minted
        pub fun batchMintBeast(
                                beastTemplate: BeastTemplate,
                                bornAt: UInt64, 
                                matron: UInt64, 
                                sire: UInt64, 
                                evolvedFrom: [UInt64], 
                                quantity: UInt64
                                ): @Collection {

            let newCollection <- create Collection()

            var count: UInt64 = 0
            while count < quantity {
                newCollection.deposit(token: <-self.mintBeast(
                                                            beastTemplate: beastTemplate,
                                                            bornAt: bornAt, 
                                                            matron: matron, 
                                                            sire: sire, 
                                                            evolvedFrom: evolvedFrom
                                                            )
                )
                count = count + 1 as UInt64
            }

            return <-newCollection
        }

    }

    // BeastData is a struct and contains the metadata of a Beast NFT
    pub struct BeastData {

        // The ID of the Set that the Beast comes from
        pub let setID: UInt32

        // The ID of the BeastTemplate that the Beast references
        pub let beastTemplate: BeastTemplate

        // The place in the edition that this Beast was minted
        // Otherwise known as the serial number
        pub let serialNumber: UInt32

        // A unix timestamp of when this beast came into existence
        pub let bornAt: UInt64
        
        // The beast ID of the matron of this beast
        // set to 0 for genesis beasts
        pub let matron: UInt64

        // The beast ID of the sire of this beast
        // set to 0 for genesis beasts
        pub let sire: UInt64

        // The beast IDs of the beasts this beast is evolved from
        // set to 0 for genesis and special beasts
        pub let evolvedFrom: [UInt64]

        init(
            setID: UInt32, 
            beastTemplate: BeastTemplate, 
            serialNumber: UInt32,
            bornAt: UInt64,
            matron: UInt64,
            sire: UInt64,
            evolvedFrom: [UInt64]
        ) {
            self.setID = setID
            self.beastTemplate = beastTemplate
            self.serialNumber = serialNumber
            self.bornAt = bornAt
            self.matron = matron
            self.sire = sire
            self.evolvedFrom = evolvedFrom
        }
    }

    // The resource that represents the Beast NFTs
    //
    pub resource NFT: NonFungibleToken.INFT {
        // Global unique beast ID
        pub let id: UInt64

        // The wallet address of the beneficiary to receive 
        // potential royalty fees from all future trades of this NFT
        pub var beneficiary: Address?

        // Struct of Beast NFT metadata
        pub let data: BeastData

        init(
            evolvedFrom: [UInt64],
            sire: UInt64,
            matron: UInt64,
            bornAt: UInt64,
            serialNumber: UInt32, 
            beastTemplate: BeastTemplate, 
            setID: UInt32, 
            ) {
            // Increment the global Beast IDs
            BasicBeast.totalSupply = BasicBeast.totalSupply + 1 as UInt64

            // Set unique beast ID to the newly incremented totalSupply
            self.id = BasicBeast.totalSupply

            // Set beneficiary to nil
            // so the admin that mints the NFT does not 
            // automatically become the beneficiary and 
            // the next holder can potentially be set as beneficiary
            self.beneficiary = nil

            // Set the metadata struct
            self.data = BeastData(
                                setID: setID, 
                                beastTemplate: beastTemplate, 
                                serialNumber: serialNumber,
                                bornAt: bornAt,
                                matron: matron,
                                sire: sire,
                                evolvedFrom: evolvedFrom
            )

            emit BeastMinted(beastID: self.id, beastTemplate: beastTemplate, setID: self.data.setID, serialNumber: self.data.serialNumber)
        }

        // setBeneficiary sets the beneficiary of this NFT
        // this action cannot be undone
        // 
        // Parameters: beneficiary: The address of the beneficiary
        //
        pub fun setBeneficiary(beneficiary: Address) {
            pre {
                self.beneficiary == nil: "Beneficiary is already initialized"
            }

            self.beneficiary = beneficiary

            emit BeastBeneficiaryIsSet(id: self.id, beneficiary: self.beneficiary!)
        }

        pub fun getBeneficiary(): Address? {
            return self.beneficiary
        }

        // If the Beast is destroyed, emit an event to indicate 
        // to outside observers that is has been destroyed.
        destroy() {
            emit BeastDestroyed(id: self.id)
        }
    }

    // Admin is a special authorization resource that
    // allows the owner to perform important functions to modify the
    // various aspects of the BeastTemplates, Sets, and Beasts
    //
    pub resource Admin {

        // createBeastTemplate creates a new BeastTemplate
        // and stores it in the BeastTemplates dictionary in the Basic Beast smart contract
        // 
        // Parameters: 
        // name: The name of the BeastTemplate
        // sex: The BeastTemplate's physical characteristics at birth. "Female" or "Male"
        // race: The race of the BeastTemplate. e.g. "Human" or "Beast"
        // rarity: The rarity of the BeastTemplate. e.g. "Legendary" or "Mythic"
        // createdAt: The timestamp of when this BeastTemplate was created.
        // createdFrom: 
        // data: A dictionary mapping other types of metadata titles to their data
        // 
        // Returns: the ID of the new BeastTemplate object
        //
        pub fun createBeastTemplate(
                                    dexNumber: UInt32,
                                    name: String, 
                                    image: String,
                                    description: String,
                                    sex: String,
                                    rarity: String,
                                    skin: String,
                                    starLevel: UInt32,
                                    ultimateSkill: String,
                                    basicSkills: [String],
                                    elements: {String: Bool},
                                    data: {String: String}
                                    ): UInt32 {
            // Create the new BeastTemplate
            var newBeastTemplate = BeastTemplate(
                                                dexNumber: dexNumber,
                                                name: name, 
                                                image: image,
                                                description: description,
                                                sex: sex,
                                                rarity: rarity,
                                                skin: skin,
                                                starLevel: starLevel,
                                                ultimateSkill: ultimateSkill,
                                                basicSkills: basicSkills,
                                                elements: elements,
                                                data: data
                                                )

            let newID = newBeastTemplate.beastTemplateID

            // Store it in the contract storage
            BasicBeast.beastTemplates[newID] = newBeastTemplate

            return newID
        }

        // createSet creates a new Set resource and stores it
        // in the sets mapping in this contract
        // 
        // Parameters: name: The name of the Set
        //
        pub fun createSet(name: String) {
            var newSet <- create Set(name: name)

            BasicBeast.sets[newSet.setID] <-! newSet
        }

        // borrowSet returns a reference to a set in the Beast
        // contract so that the admin can call methods on it
        //
        // Parameters: setID: The ID of the set that you want to
        // get a reference to
        //
        // Returns: A reference to the set with all of the fields
        // and methods exposed
        //
        pub fun borrowSet(setID: UInt32): &Set {
            pre {
                BasicBeast.sets[setID] != nil: "Cannot borrow Set: The Set doesn't exist."
            }

            // use `&` to indicate the reference to the object and/(as) type. 
            return &BasicBeast.sets[setID] as &Set
        }

        // startNewGeneration ends the current generation by incrementing
        // the generation number, meaning that beasts will be using the 
        // new generation number from now on
        //
        // Returns: The new generation number
        //
        pub fun startNewGeneration(): UInt32 {
            // end the current generation and start a new one
            // by incrementing the be number
            BasicBeast.currentGeneration = BasicBeast.currentGeneration + 1 as UInt32

            emit NewGenerationStarted(newCurrentGeneration: BasicBeast.currentGeneration)

            return BasicBeast.currentGeneration
        }

        // updateHeroStructDataByField updates a HeroStruct's data
        // by adding a new key-value-pair or changing an existing key's 
        // value in the data dictionary
        //
        // Parameters: 
        // heroStructID: The id of the HeroStruct to update
        // key: The new key or existing key to insert into data
        // value: The value that is to be inserted with the key
        //
        // Returns: The data as a String to String mapping optional
        //
        pub fun updateBeastTemplateDataByField(beastTemplateID: UInt32, key: String, value: String): {String: String}? {
            pre {
                BasicBeast.beastTemplates[beastTemplateID] != nil: "Cannot update HeroStruct: The HeroStruct doesn't exist."
            }

            let old = BasicBeast.beastTemplates[beastTemplateID]?.data?.insert(key: key, value)

            emit NewBeastTemplateDataFieldAdded(beastTemplateID: beastTemplateID, key: key, value: value)

            return BasicBeast.beastTemplates[beastTemplateID]?.data
        }

        // removeHeroStructDataByField removes a key from 
        // a HeroStruct's data dictionary
        //
        // Parameters: 
        // heroStructID: The id of the HeroStruct to update
        // key: The key that is to be removed from the data dictionary
        //
        // Returns: The removed key as a String optional
        //
        pub fun removeBeastTemplateDataByField(beastTemplateID: UInt32, key: String): String??  {
            pre {
                BasicBeast.beastTemplates[beastTemplateID] != nil: "Cannot change HeroStruct data: The HeroStruct doesn't exist."
            }

            let removedKey = BasicBeast.beastTemplates[beastTemplateID]?.data?.remove(key: key)

            emit BeastTemplateDataFieldRemoved(beastTemplateID: beastTemplateID, key: key)

            return removedKey
        }

        // createNewAdmin creates a new Admin Resource
        //
        pub fun createNewAdmin(): @Admin {
            return <-create Admin()
        }
    }

    // This is the interface that users can cast their Hero Collection as
    // to allow others to deposit heroes into their collection
    //
    pub resource interface BeastCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowBeast(id: UInt64): &BasicBeast.NFT? { 
            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrw Beast reference: The ID of the returned reference is incorrect"
            }
        }
    }

    // Collection is a resource that every user who owns NFTs 
    // will store in their account to manage their NFTs
    //
    pub resource Collection: BeastCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        // Dictionary of Hero conforming tokens
        // NFT is a resource type with a UInt64 ID field
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        // withdraw removes a Hero from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {

            let token <- self.ownedNFTs.remove(key: withdrawID) 
                ?? panic("Cannot withdraw: The Beast does not exist in the Collection")

            emit Withdraw(id: token.id, from: self.owner?.address)
            
            return <-token
        }

        // batchWithdraw withdraws multiple tokens and returns them as a Collection
        pub fun batchWithdraw(ids: [UInt64]): @NonFungibleToken.Collection {
            // Create a new empty Collection
            var batchCollection <- create Collection()
            
            // Iterate through the ids and withdraw them from the Collection
            for id in ids {
                batchCollection.deposit(token: <-self.withdraw(withdrawID: id))
            }
            
            // Return the withdrawn tokens
            return <-batchCollection
        }

        // deposit takes a Hero and adds it to the collections dictionary
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @BasicBeast.NFT

            let id = token.id
            
            // add the new token to the dictionary
            let oldToken <- self.ownedNFTs[id] <- token

            if self.owner?.address != nil {
                emit Deposit(id: id, to: self.owner?.address)
            }

            destroy oldToken
        }

        // batchDeposit takes a Collection object as an argument
        // and deposits each contained NFT into this collection
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection) {
            let keys = tokens.getIDs()

            // Iterate through the keys in the collection and deposit each one
            for key in keys {
                self.deposit(token: <-tokens.withdraw(withdrawID: key))
            }

            destroy tokens
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // borrowNFT Returns a borrowed reference to a Hero in the collection
        // so that the caller can read its ID
        //
        // Parameters: id: The ID of the NFT to get the reference for
        //
        // Returns: A reference to the NFT
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        // borrowHero Returns a borrowed reference to a Hero in the collection
        // so that the caller can read data and call methods from it
        // They can use this to read its setID, heroStructID, serialNumber,
        // or any of the setData or Hero Data associated with it by
        // getting the setID or heroStructID and reading those fields from
        // the smart contract
        //
        // Parameters: id: The ID of the NFT to get the reference for
        //
        // Returns: A reference to the NFT
        pub fun borrowBeast(id: UInt64): &BasicBeast.NFT? {

            if self.ownedNFTs[id] != nil { 
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
                return ref as! &BasicBeast.NFT
            } else {
                return nil
            }

        }

        // If a transaction destroys the Collection object,
        // All the NFTs contained within are also destroyed
        //
        destroy() {
            destroy self.ownedNFTs
        }
    }

    // -----------------------------------------------------------------------
    // Basic Beast contract-level function definitions
    // -----------------------------------------------------------------------

    // createEmptyCollection creates a new, empty Collection object so that
    // a user can store it in their account storage.
    // Once they have a Collection in their storage, they are able to receive
    // Moments in transactions
    //
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <-create BasicBeast.Collection()
    }

    pub fun getAllBeastTemplates(): [BasicBeast.BeastTemplate] {
        return BasicBeast.beastTemplates.values
    }

    pub fun getBeastDexNumber(beastTemplateID: UInt32): UInt32? {
        return self.beastTemplates[beastTemplateID]?.dexNumber
    }

    pub fun getBeastName(beastTemplateID: UInt32): String? {
        return self.beastTemplates[beastTemplateID]?.name
    }

    pub fun getCharacterSex(characterID: UInt32): String? {
        return self.beastTemplates[characterID]?.sex
    }

    pub fun getCharacterRarity(characterID: UInt32): String? {
        return self.beastTemplates[characterID]?.rarity
    }

    pub fun getAllCharacterMetaData(characterID: UInt32): BasicBeast.BeastTemplate? {
        return self.beastTemplates[characterID]
    }

    // getBeastTemplateBasicSkills returns all the basic skills associated with a specific BeastTemplate
    // 
    // Parameters: beastTemplateID: The id of the BeastTemplate that is being searched
    //
    // Returns: The basic skills as a String array optional
    pub fun getBeastTemplateBasicSkills(beastTemplateID: UInt32): [String]? {
        // Don't force a revert if the beastTemplateID is invalid
        return self.beastTemplates[beastTemplateID]?.basicSkills
    }

    // getBeastTemplateElements returns all the elements associated with a specific BeastTemplate
    // 
    // Parameters: beastTemplateID: The id of the BeastTemplate that is being searched
    //
    // Returns: The elements as a String to String mapping optional
    pub fun getBeastTemplateElements(beastTemplateID: UInt32): {String: Bool}? {
        // Don't force a revert if the beastTemplateID is invalid
        return self.beastTemplates[beastTemplateID]?.elements
    }

    // getBeastTemplatesElementsByField returns the elements associated with a 
    // specific field of the elements
    // 
    // Parameters: beastTemplates: The id of the BeastTemplate that is being searched
    //
    // Returns: The elements field as a String optional
    pub fun getBeastTemplateElementsByField(beastTemplateID: UInt32, field: String): Bool? {
        // Don't force a revert if the beastTemplateID or field is invalid
        if let beastTemplates = BasicBeast.beastTemplates[beastTemplateID] {
            return beastTemplates.elements[field]
        } else {
            return nil
        }
    }

    // getBeastTemplateData returns all the other data associated with a specific BeastTemplate
    // 
    // Parameters: beastTemplateID: The id of the BeastTemplate that is being searched
    //
    // Returns: The data as a String to String mapping optional
    pub fun getBeastTemplateData(beastTemplateID: UInt32): {String: String}? {
        // Don't force a revert if the beastTemplateID is invalid
        return self.beastTemplates[beastTemplateID]?.data
    }

    // getBeastTemplateDataByField returns the data associated with a 
    // specific field of the data dictionary
    // 
    // Parameters: beastTemplateID: The id of the BeastTemplate that is being searched
    //
    // Returns: The data field as a String optional
    pub fun getBeastTemplateDataByField(beastTemplateID: UInt32, field: String): String? {
        // Don't force a revert if the beastTemplateID or field is invalid
        if let beastTemplate = BasicBeast.beastTemplates[beastTemplateID] {
            return beastTemplate.data[field]
        } else {
            return nil
        }
    } 
    
    // getSetName returns the name that the specified set
    //            is associated with.
    // 
    // Parameters: setID: The id of the set that is being searched
    //
    // Returns: The name of the set
    pub fun getSetName(setID: UInt32): String? {
        // Don't force a revert if the setID is invalid
        return BasicBeast.sets[setID]?.name
    }

    // getSetGeneration returns the generation that the specified set
    //              is associated with.
    // 
    // Parameters: setID: The id of the set that is being searched
    //
    // Returns: The generation that the set belongs to
    pub fun getSetGeneration(setID: UInt32): UInt32? {
        // Don't force a revert if the setID is invalid
        return BasicBeast.sets[setID]?.generation
    }

    // getSetIDsByName returns the IDs that the specified set name
    //                 is associated with.
    // 
    // Parameters: setName: The name of the set that is being searched
    //
    // Returns: An array of the IDs of the set if it exists, or nil if doesn't
    pub fun getSetIDsByName(setName: String): [UInt32]? {
        var setIDs: [UInt32] = []

        // Iterate through all the setDatas and search for the name
        for setID in self.sets.keys {
            // If the name is found, return the ID
            if setName == BasicBeast.SetData(setID: setID).name {
                setIDs.append(setID)
            }
        }
        
        // If the name isn't found, return nil
        // Don't force a revert if the setName is invalid
        if setIDs.length == 0 {
            return nil
        } else {
            return setIDs
        }
    }

    // getBeastTemplatesInSet returns the list of beastTemplatesIDs that are in the set
    // 
    // Parameters: setID: The id of the set that is being searched
    //
    // Returns: An array of beastTemplatesIDs
    pub fun getBeastTemplatesInSet(setID: UInt32): [UInt32]? {
        // Don't force a revert if the setID is invalid
        return BasicBeast.sets[setID]?.beastTemplatesInSet
    }

    // isEditionRetired returns a boolean that indicates if a set/beastTemplate combo
    //                  (otherwise known as a beast edition) is retired.
    //                  If a beast edition is retired, it still remains in the set,
    //                  but beasts can no longer be minted from it.
    // 
    // Parameters: setID: The id of the set that is being searched
    //             beastTemplateID: The id of the BeastTemplate that is being searched
    //
    // Returns: Boolean indicating if the beast edition is retired or not
    pub fun isEditionRetired(setID: UInt32, beastTemplateID: UInt32): Bool? {
        // Don't force a revert if the set or character ID is invalid
        // Remove the set from the dictionary to get its field
        if let setToRead <- BasicBeast.sets.remove(key: setID) {

            // See if the Character is retired from this Set
            let retired = setToRead.retired[beastTemplateID]

            // Put the Set back in the contract storage
            BasicBeast.sets[setID] <-! setToRead

            // Return the retired status
            return retired
        } else {

            // If the Set wasn't found, return nil
            return nil
        }
    }

    // isSetLocked returns a boolean that indicates if a set
    //             is locked. If an set is locked, 
    //             new BeastTemplates can no longer be added to it,
    //             but beasts can still be minted from BeastTemplates
    //             that are currently in it.
    // 
    // Parameters: setID: The id of the set that is being searched
    //
    // Returns: Boolean indicating if the set is locked or not
    pub fun isSetLocked(setID: UInt32): Bool? {
        // Don't force a revert if the setID is invalid
        return BasicBeast.sets[setID]?.locked
    }

    // getNumBeastsInEdition return the number of beasts that have been 
    //                        minted from a certain beasts edition.
    //
    // Parameters: setID: The id of the set that is being searched
    //             beastTemplateID: The id of the BeastTemplate that is being searched
    //
    // Returns: The total number of beasts 
    //          that have been minted from a specific BeastTemplate
    pub fun getNumBeastsInEdition(setID: UInt32, characterID: UInt32): UInt32? {

        if let setToRead <- BasicBeast.sets.remove(key: setID) {

            // Read the numOfMintedPerBeastTemplate
            let amount = setToRead.numOfMintedPerBeastTemplate[characterID]

            // Put the Set back into the Sets dictionary
            BasicBeast.sets[setID] <-! setToRead

            return amount
        } else {
            // If the set wasn't found return nil
            return nil
        }
    }

    // -----------------------------------------------------------------------
    // BasicBeast contract initialization function
    // -----------------------------------------------------------------------
    //
    init() {
        // Initialize the named paths
        self.CollectionStoragePath = /storage/BasicBeastCollection
        self.CollectionPublicPath = /public/BasicBeastCollection
        self.AdminStoragePath = /storage/BasicBeastAdmin

        // Initialize the fields
        self.currentGeneration = 1
        self.beastTemplates = {}
        self.sets <- {}
        self.nextBeastTemplateID = 0
        self.nextSetID = 0
        self.totalSupply = 0

        // Put a new Collection in storage
        self.account.save<@Collection>(<- create Collection(), to: self.CollectionStoragePath)

        // Create a public capability for the Collection
        self.account.link<&{BeastCollectionPublic}>(self.CollectionPublicPath, target: self.CollectionStoragePath)

        // Put the Minter in storage
        self.account.save<@Admin>(<- create Admin(), to: self.AdminStoragePath)
        
        emit ContractInitialized()
    }

}
 