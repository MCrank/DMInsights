--DROP DATABASE [ IF EXISTS ] { database_name | database_snapshot_name } [ ,...n ] [;]
IF EXISTS (
        SELECT [name]
FROM sys.databases
WHERE [name] = N'DMInsights'
        )
BEGIN
    -- Delete Database Backup and Restore History from MSDB System Database
    EXEC msdb.dbo.sp_delete_database_backuphistory @database_name = N'DMInsights'

    -- GO
    -- Close Connections
    USE [master]

    -- GO
    ALTER DATABASE [DMInsights]

    SET SINGLE_USER
    WITH

    ROLLBACK IMMEDIATE

    -- GO
    -- Drop Database in SQL Server
    DROP DATABASE [DMInsights]
-- GO
END

-- Create a new database called 'DMInsights'
-- Connect to the 'master' database to run this snippet
USE master
GO

-- Create the new database if it does not exist already
IF NOT EXISTS (
        SELECT [name]
FROM sys.databases
WHERE [name] = N'DMInsights'
        )
    CREATE DATABASE DMInsights
GO

USE DMInsights
GO

-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/sweMRF
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.
SET XACT_ABORT ON

BEGIN TRANSACTION DMI_CREATE

CREATE TABLE [Users]
(
    [Id] INT IDENTITY(1, 1) NOT NULL,
    [FirstName] NVARCHAR(255) NOT NULL,
    [LastName] NVARCHAR(255) NOT NULL,
    [UserName] NVARCHAR(255) NOT NULL,
    [IdToken] NVARCHAR(255) NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC)
)

CREATE TABLE [Campaigns]
(
    [Id] INT IDENTITY(1, 1) NOT NULL,
    [Title] NVARCHAR(255) NOT NULL,
    [Description] NVARCHAR(255) NOT NULL,
    [ImageUrl] NVARCHAR(255),
    [ConnectionID] UNIQUEIDENTIFIER NOT NULL,
    [OwnerId] INT NOT NULL,
    CONSTRAINT [PK_Campaigns] PRIMARY KEY CLUSTERED ([Id] ASC)
)

CREATE TABLE [CampaignsUsers]
(
    [UserId] INT NOT NULL,
    [CampaignId] INT NOT NULL
)

CREATE TABLE [PlayerCharacters]
(
    [Id] INT IDENTITY(1, 1) NOT NULL,
    [Name] NVARCHAR(255) NOT NULL,
    [HitPoints] INT NOT NULL,
    [ArmorClass] INT NOT NULL,
    [Description] NVARCHAR(500),
    [ImageUrl] NVARCHAR(255),
    [MoveSpeed] INT NOT NULL,
    [OwnerId] INT NOT NULL,
    [CharacterRace] NVARCHAR(255) NOT NULL,
    [CharacterType] NVARCHAR(255) NOT NULL,
    [PassivePerception] INT NOT NULL,
    [InitiativeModifier] INT NOT NULL,
    [SpellSaveDC] INT,
    [Classes] NVARCHAR(255) NOT NULL,
    [Level] INT NOT NULL,
    [CampaignId] INT,
    [IsDeleted] BIT NOT NULL
    CONSTRAINT [PK_PlayerCharacters] PRIMARY KEY CLUSTERED ([Id] ASC)
)

CREATE TABLE [NonPlayerCharacters]
(
    [Id] INT IDENTITY(1, 1) NOT NULL,
    [Name] nvarchar(255) NOT NULL,
    [HitPoints] INT NOT NULL,
    [ArmorClass] INT NOT NULL,
    [Description] NVARCHAR(255) ,
    [ImageUrl] NVARCHAR(255) ,
    [MoveSpeed] INT NOT NULL,
    [OwnerId] INT NOT NULL,
    [CharacterRace] NVARCHAR(255) ,
    [CharacterType] NVARCHAR(255) NOT NULL,
    [PassivePerception] INT NOT NULL,
    [InitiativeModifier] INT ,
    [SpellSaveDC] INT ,
    [ChallengeRating] DECIMAL(5,3) NOT NULL,
    [CampaignId] INT,
    [IsDeleted] BIT NOT NULL
    CONSTRAINT [PK_NonPlayerCharacters] PRIMARY KEY CLUSTERED ([Id] ASC)
)

CREATE TABLE [GameSessions]
(
    [Id] INT IDENTITY(1, 1) NOT NULL,
    [Title] NVARCHAR(255) NOT NULL,
    [Description] NVARCHAR(255) NOT NULL,
    [CampaignId] INT NOT NULL,
    [OwnerId] INT NOT NULL,
    [DateCreated] DATETIME NOT NULL,
    CONSTRAINT [PK_GameSessions] PRIMARY KEY CLUSTERED ([Id] ASC)
)

CREATE TABLE [GameSessionPlayerCharacters]
(
    [PlayerCharacterId] INT NOT NULL,
    [GameSessionId] INT NOT NULL
)

CREATE TABLE [Encounters]
(
    [Id] INT IDENTITY(1, 1) NOT NULL,
    [DateCreated] DATETIME NOT NULL,
    [GameSessionId] INT NOT NULL,
    CONSTRAINT [PK_Encounters] PRIMARY KEY CLUSTERED ([Id] ASC)
)

CREATE TABLE [EncounterPlayerCharacters]
(
    [Id] INT IDENTITY(1, 1) NOT NULL,
    [CharacterId] INT NOT NULL,
    [CurrentHP] INT NOT NULL,
    [EncounterId] INT NOT NULL,
    [Initiative] INT NOT NULL,
    [Notes] NVARCHAR(max) ,
    [StatusEffects] NVARCHAR(255) ,
    CONSTRAINT [PK_EncounterPlayerCharacters] PRIMARY KEY CLUSTERED ([Id] ASC)
)

CREATE TABLE [EncounterNonPlayerCharacters]
(
    [Id] INT IDENTITY(1, 1) NOT NULL,
    [NpcCharacterId] INT NOT NULL,
    [CurrentHP] INT NOT NULL,
    [EncounterId] INT NOT NULL,
    [Inititaive] INT NOT NULL,
    [Notes] NVARCHAR(max) ,
    [StatusEffects] NVARCHAR(255) ,
    [SledDesignation] INT ,
    CONSTRAINT [PK_EncounterNonPlayerCharacters] PRIMARY KEY CLUSTERED ([Id] ASC)
)

ALTER TABLE [Campaigns]
    WITH CHECK ADD CONSTRAINT [FK_Campaigns_OwnerId] FOREIGN KEY ([OwnerId]) REFERENCES [Users]([Id])

ALTER TABLE [Campaigns] CHECK CONSTRAINT [FK_Campaigns_OwnerId]

ALTER TABLE [CampaignsUsers]
    WITH CHECK ADD CONSTRAINT [FK_CampaignsUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id])

ALTER TABLE [CampaignsUsers] CHECK CONSTRAINT [FK_CampaignsUsers_UserId]

ALTER TABLE [CampaignsUsers]
    WITH CHECK ADD CONSTRAINT [FK_CampaignsUsers_CampaignId] FOREIGN KEY ([CampaignId]) REFERENCES [Campaigns]([Id])

ALTER TABLE [CampaignsUsers] CHECK CONSTRAINT [FK_CampaignsUsers_CampaignId]

ALTER TABLE [PlayerCharacters]
    WITH CHECK ADD CONSTRAINT [FK_PlayerCharacters_OwnerId] FOREIGN KEY ([OwnerId]) REFERENCES [Users]([Id])

ALTER TABLE [PlayerCharacters] CHECK CONSTRAINT [FK_PlayerCharacters_OwnerId]

ALTER TABLE [PlayerCharacters]
    WITH CHECK ADD CONSTRAINT [FK_PlayerCharacters_CampaignId] FOREIGN KEY ([CampaignId]) REFERENCES [Campaigns]([Id])

ALTER TABLE [PlayerCharacters] CHECK CONSTRAINT [FK_PlayerCharacters_CampaignId]

ALTER TABLE [NonPlayerCharacters]
    WITH CHECK ADD CONSTRAINT [FK_NonPlayerCharacters_OwnerId] FOREIGN KEY ([OwnerId]) REFERENCES [Users]([Id])

ALTER TABLE [NonPlayerCharacters] CHECK CONSTRAINT [FK_NonPlayerCharacters_OwnerId]

ALTER TABLE [NonPlayerCharacters]
    WITH CHECK ADD CONSTRAINT [FK_NonPlayerCharacters_CampaignId] FOREIGN KEY ([CampaignId]) REFERENCES [Campaigns]([Id])

ALTER TABLE [NonPlayerCharacters] CHECK CONSTRAINT [FK_NonPlayerCharacters_CampaignId]

ALTER TABLE [GameSessions]
    WITH CHECK ADD CONSTRAINT [FK_GameSessions_CampaignId] FOREIGN KEY ([CampaignId]) REFERENCES [Campaigns]([Id])

ALTER TABLE [GameSessions] CHECK CONSTRAINT [FK_GameSessions_CampaignId]

ALTER TABLE [GameSessions]
    WITH CHECK ADD CONSTRAINT [FK_GameSessions_OwnerId] FOREIGN KEY ([OwnerId]) REFERENCES [Users]([Id])

ALTER TABLE [GameSessions] CHECK CONSTRAINT [FK_GameSessions_OwnerId]

ALTER TABLE [GameSessionPlayerCharacters]
    WITH CHECK ADD CONSTRAINT [FK_GameSessionPlayerCharacters_PlayerCharacterId] FOREIGN KEY ([PlayerCharacterId]) REFERENCES [PlayerCharacters]([Id])

ALTER TABLE [GameSessionPlayerCharacters] CHECK CONSTRAINT [FK_GameSessionPlayerCharacters_PlayerCharacterId]

ALTER TABLE [GameSessionPlayerCharacters]
    WITH CHECK ADD CONSTRAINT [FK_GameSessionPlayerCharacters_GameSessionId] FOREIGN KEY ([GameSessionId]) REFERENCES [GameSessions]([Id])

ALTER TABLE [GameSessionPlayerCharacters] CHECK CONSTRAINT [FK_GameSessionPlayerCharacters_GameSessionId]

ALTER TABLE [Encounters]
    WITH CHECK ADD CONSTRAINT [FK_Encounters_GameSessionId] FOREIGN KEY ([GameSessionId]) REFERENCES [GameSessions]([Id])

ALTER TABLE [Encounters] CHECK CONSTRAINT [FK_Encounters_GameSessionId]

ALTER TABLE [EncounterPlayerCharacters]
    WITH CHECK ADD CONSTRAINT [FK_EncounterPlayerCharacters_CharacterId] FOREIGN KEY ([CharacterId]) REFERENCES [PlayerCharacters]([Id])

ALTER TABLE [EncounterPlayerCharacters] CHECK CONSTRAINT [FK_EncounterPlayerCharacters_CharacterId]

ALTER TABLE [EncounterPlayerCharacters]
    WITH CHECK ADD CONSTRAINT [FK_EncounterPlayerCharacters_EncounterId] FOREIGN KEY ([EncounterId]) REFERENCES [Encounters]([Id])

ALTER TABLE [EncounterPlayerCharacters] CHECK CONSTRAINT [FK_EncounterPlayerCharacters_EncounterId]

ALTER TABLE [EncounterNonPlayerCharacters]
    WITH CHECK ADD CONSTRAINT [FK_EncounterNonPlayerCharacters_Id] FOREIGN KEY ([NpcCharacterId]) REFERENCES [NonPlayerCharacters]([Id])

ALTER TABLE [EncounterNonPlayerCharacters] CHECK CONSTRAINT [FK_EncounterNonPlayerCharacters_Id]

ALTER TABLE [EncounterNonPlayerCharacters]
    WITH CHECK ADD CONSTRAINT [FK_EncounterNonPlayerCharacters_EncounterId] FOREIGN KEY ([EncounterId]) REFERENCES [Encounters]([Id])

ALTER TABLE [EncounterNonPlayerCharacters] CHECK CONSTRAINT [FK_EncounterNonPlayerCharacters_EncounterId]
GO

COMMIT TRANSACTION DMI_CREATE

USE [master]
GO

ALTER DATABASE [DMInsights]

SET READ_WRITE
GO

BEGIN TRANSACTION DMI_SEED

-- USERS
BEGIN
    USE [DMInsights]

    INSERT INTO [dbo].[Users]
        ([FirstName], [LastName], [UserName], [IdToken])
    VALUES
        ('Charmane', 'Strass', 'ladiesman', '7e8f2f4be79f7af1d2adcde3b08925b4')

    INSERT INTO [dbo].[Users]
        ([FirstName], [LastName], [UserName], [IdToken])
    VALUES
        ('Carlyle', 'Vedyaev', 'Creeper', 'be20c1883082f85898596d9e9496156c')

    INSERT INTO [dbo].[Users]
        ([FirstName], [LastName], [UserName], [IdToken])
    VALUES
        ('Giovanni', 'Moggach', 'Solstice', '0c2a81680b1bf079bd8f3121f19d73c8')

    INSERT INTO [dbo].[Users]
        ([FirstName], [LastName], [UserName], [IdToken])
    VALUES
        ('Marco', 'Crank', 'marco_mcse@hotmail.com', '00uujnwjxbFP3qXr3356')

END

-- Campaigns
BEGIN
    USE [DMInsights]

    INSERT INTO [dbo].[Campaigns]
        ([Title], [Description], [ImageUrl], [ConnectionID], [OwnerId])
    VALUES
        ('Curse of Strahd', 'Vampire slaying at it''s best', 'https://wellmetblog.files.wordpress.com/2016/10/curse_of_strahd_wallpaper_gallery_thumb.jpg?w=816', '262cdab8-6f69-493e-bf71-5da5fb8063f9', 2)

    INSERT INTO [dbo].[Campaigns]
        ([Title], [Description], [ImageUrl], [ConnectionID], [OwnerId])
    VALUES
        ('Tomb of Annihilation', 'Yo dawg, I heard you like traps', 'https://4.bp.blogspot.com/-EVKCmcepH5E/WWBFQ5sy0MI/AAAAAAAAMoI/94Yalf6kkpUgFXft1SCI49kI7a7aAAzmgCLcBGAs/s1600/tombofannihillogo.jpg', 'c4238c70-b74c-44a2-953a-93dd0e5cd3f5', 4)

    INSERT INTO [dbo].[Campaigns]
        ([Title], [Description], [ImageUrl], [ConnectionID], [OwnerId])
    VALUES
        ('Horde of the Dragon Queen', 'Cultists, Why''d it have to be cultists', 'https://nerdvanamedia.com/wp-content/uploads/2014/08/hotdq5efeat.jpg', 'd08697e2-e57c-48fd-ab78-04d8ba0bb753', 2)

    INSERT INTO [dbo].[Campaigns]
        ([Title], [Description], [ImageUrl], [ConnectionID], [OwnerId])
    VALUES
        ('Storm Kings Thunder', 'Dragons and Giants, YIKES!', 'http://geekandsundry.com/wp-content/uploads/2016/07/StormKingsThunder_header.jpg', 'f4722b0f-023f-4488-937b-627420b30d16', 3)
END

-- CampaignsUsers
BEGIN
    USE [DMInsights]

    INSERT INTO [dbo].[CampaignsUsers]
        ([UserId], [CampaignId])
    VALUES
        (1, 2)

    INSERT INTO [dbo].[CampaignsUsers]
        ([UserId], [CampaignId])
    VALUES
        (2, 1)

    INSERT INTO [dbo].[CampaignsUsers]
        ([UserId], [CampaignId])
    VALUES
        (2, 3)

    INSERT INTO [dbo].[CampaignsUsers]
        ([UserId], [CampaignId])
    VALUES
        (3, 4)

    INSERT INTO [dbo].[CampaignsUsers]
        ([UserId], [CampaignId])
    VALUES
        (2, 2)

    INSERT INTO [dbo].[CampaignsUsers]
        ([UserId], [CampaignId])
    VALUES
        (2, 4)

    INSERT INTO [dbo].[CampaignsUsers]
        ([UserId], [CampaignId])
    VALUES
        (3, 1)

    INSERT INTO [dbo].[CampaignsUsers]
        ([UserId], [CampaignId])
    VALUES
        (1, 3)

    INSERT INTO [dbo].[CampaignsUsers]
        ([UserId], [CampaignId])
    VALUES
        (4, 1)

    INSERT INTO [dbo].[CampaignsUsers]
        ([UserId], [CampaignId])
    VALUES
        (4, 2)
END

-- Player Characters
BEGIN
    USE [DMInsights]

    INSERT INTO [dbo].[PlayerCharacters]
        ([Name], [HitPoints], [ArmorClass], [Description], [ImageUrl], [MoveSpeed], [OwnerId], [CharacterRace], [CharacterType], [PassivePerception], [InitiativeModifier], [SpellSaveDC], [Classes], [Level], [CampaignId], [IsDeleted])
    VALUES
        ('Bazquirk', 49, 16, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://gamepedia.cursecdn.com/witcher_gamepedia/9/9f/Tw3_cardart_nilfgaard_vreemde.png?version=9707f7c3165dea9fc2f77df68230395c', 30, 1, 'Human', 'Humanoid', 13, 4, 14, 'Cleric', 8, 1, 0)

    INSERT INTO [dbo].[PlayerCharacters]
        ([Name], [HitPoints], [ArmorClass], [Description], [ImageUrl], [MoveSpeed], [OwnerId], [CharacterRace], [CharacterType], [PassivePerception], [InitiativeModifier], [SpellSaveDC], [Classes], [Level], [CampaignId], [IsDeleted])
    VALUES
        ('Foobar', 124, 18, 'You''re my boy Blue!', 'https://wiki.rpg.net/images/6/64/Vagha_Blue_Dragonborn.jpg', 30, 4, 'Dragon Born', 'Dragon', 13, 4, 16, 'Paladin', 12, 2, 0)

    INSERT INTO [dbo].[PlayerCharacters]
        ([Name], [HitPoints], [ArmorClass], [Description], [ImageUrl], [MoveSpeed], [OwnerId], [CharacterRace], [CharacterType], [PassivePerception], [InitiativeModifier], [SpellSaveDC], [Classes], [Level], [CampaignId], [IsDeleted])
    VALUES
        ('Bisquick', 21, 13, 'Fire slinger', 'https://upload.wikimedia.org/wikipedia/en/0/09/Minsc.jpg', 30, 3, 'Human', 'Humanoid', 12, 1, 15, 'Wizard', 2, 3, 0)

    INSERT INTO [dbo].[PlayerCharacters]
        ([Name], [HitPoints], [ArmorClass], [Description], [ImageUrl], [MoveSpeed], [OwnerId], [CharacterRace], [CharacterType], [PassivePerception], [InitiativeModifier], [SpellSaveDC], [Classes], [Level], [CampaignId], [IsDeleted])
    VALUES
        ('FizzBazz', 52, 17, 'Short and Stour', 'http://lrpc.wdfiles.com/local--files/dwarf/F%20Hill%20Dwarf.png', 25, 3, 'Dwarf', 'Humanoid', 11, 3, NULL, 'Fighter', 8, 4, 0)

    INSERT INTO [dbo].[PlayerCharacters]
        ([Name], [HitPoints], [ArmorClass], [Description], [ImageUrl], [MoveSpeed], [OwnerId], [CharacterRace], [CharacterType], [PassivePerception], [InitiativeModifier], [SpellSaveDC], [Classes], [Level], [CampaignId], [IsDeleted])
    VALUES
        ('Furry', 67, 19, 'He was a great hero', 'https://i.stack.imgur.com/bp4Ysm.jpg', 55, 1, 'Half-Elf', 'Humanoid', 16, 5, 16, 'Monk', 10, NULL, 0)

    INSERT INTO [dbo].[PlayerCharacters]
        ([Name], [HitPoints], [ArmorClass], [Description], [ImageUrl], [MoveSpeed], [OwnerId], [CharacterRace], [CharacterType], [PassivePerception], [InitiativeModifier], [SpellSaveDC], [Classes], [Level], [CampaignId], [IsDeleted])
    VALUES
        ('Beeyatch', 75, 15, 'Sorceress', 'https://gamepedia.cursecdn.com/witcher_gamepedia/c/c3/Tw3_cardart_northernrealms_keira.png', 30, 4, 'Human', 'Humanoid', 11, 1, 17, 'Sorcerer', 12, 4, 0)
END

-- GameSessions
BEGIN
    USE [DMInsights]
    INSERT INTO [dbo].[GameSessions]
        ([Title], [Description], [CampaignId], [OwnerId], [DateCreated])
    VALUES
        ('Treeflex', 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.', 4, 3, '2018-10-31 17:23:22')

    INSERT INTO [dbo].[GameSessions]
        ([Title], [Description], [CampaignId], [OwnerId], [DateCreated])
    VALUES
        ('Greenlam', 'Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.', 3, 1, '2018-09-15 20:45:35')

    INSERT INTO [dbo].[GameSessions]
        ([Title], [Description], [CampaignId], [OwnerId], [DateCreated])
    VALUES
        ('Bigtax', 'Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.', 2, 3, '2018-10-31 17:23:22')

    INSERT INTO [dbo].[GameSessions]
        ([Title], [Description], [CampaignId], [OwnerId], [DateCreated])
    VALUES
        ('Matsoft', 'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.', 4, 3, '2018-10-05 10:58:13')

    INSERT INTO [dbo].[GameSessions]
        ([Title], [Description], [CampaignId], [OwnerId], [DateCreated])
    VALUES
        ('Sonair', 'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.', 2, 2, '2018-12-08 09:35:31')
END

-- GameSessionPlayerCharacter
BEGIN
    USE [DMInsights]
    INSERT INTO [dbo].[GameSessionPlayerCharacters]
        ([PlayerCharacterId], [GameSessionId])
    VALUES
        (1, 1)

    INSERT INTO [dbo].[GameSessionPlayerCharacters]
        ([PlayerCharacterId], [GameSessionId])
    VALUES
        (2, 1)

    INSERT INTO [dbo].[GameSessionPlayerCharacters]
        ([PlayerCharacterId], [GameSessionId])
    VALUES
        (4, 1)

    INSERT INTO [dbo].[GameSessionPlayerCharacters]
        ([PlayerCharacterId], [GameSessionId])
    VALUES
        (3, 2)

    INSERT INTO [dbo].[GameSessionPlayerCharacters]
        ([PlayerCharacterId], [GameSessionId])
    VALUES
        (5, 2)

    INSERT INTO [dbo].[GameSessionPlayerCharacters]
        ([PlayerCharacterId], [GameSessionId])
    VALUES
        (6, 2)
END

-- NonPlayerCharacters
BEGIN
    USE [DMInsights]
    INSERT INTO [dbo].[NonPlayerCharacters]
        ([Name], [HitPoints], [ArmorClass], [Description], [ImageUrl], [MoveSpeed], [OwnerId], [CharacterRace], [CharacterType], [PassivePerception], [InitiativeModifier], [SpellSaveDC], [ChallengeRating], [IsDeleted])
    VALUES
        ('Orc', 24, 13, 'Scary Monster', 'https://upload.wikimedia.org/wikipedia/en/5/5e/Lizard_Man_%28D%26D%29.JPG', 30, 2, '', 'Beast', 10, 0, NULL, 0.5, 0)

    INSERT INTO [dbo].[NonPlayerCharacters]
        ([Name], [HitPoints], [ArmorClass], [Description], [ImageUrl], [MoveSpeed], [OwnerId], [CharacterRace], [CharacterType], [PassivePerception], [InitiativeModifier], [SpellSaveDC], [ChallengeRating], [IsDeleted])
    VALUES
        ('Mind Flayer', 287, 16, 'Brains', 'https://upload.wikimedia.org/wikipedia/en/1/13/Illithid_Sorcerer.png', 30, 1, '', 'Humanoid', 16, 2, 16, 1.5, 0)

    INSERT INTO [dbo].[NonPlayerCharacters]
        ([Name], [HitPoints], [ArmorClass], [Description], [ImageUrl], [MoveSpeed], [OwnerId], [CharacterRace], [CharacterType], [PassivePerception], [InitiativeModifier], [SpellSaveDC], [ChallengeRating], [IsDeleted])
    VALUES
        ('Kobold', 13, 12, 'Cannon Fodder', 'http://fang.wdfiles.com/local--files/tod-sessions/kobold_dagger.png', 30, 1, '', 'Beast', 10, -1, NULL, 0.25, 0)

    INSERT INTO [dbo].[NonPlayerCharacters]
        ([Name], [HitPoints], [ArmorClass], [Description], [ImageUrl], [MoveSpeed], [OwnerId], [CharacterRace], [CharacterType], [PassivePerception], [InitiativeModifier], [SpellSaveDC], [ChallengeRating], [IsDeleted])
    VALUES
        ('Tiamat', 578, 20, 'Mother of Dragons', 'http://eberronunlimited.wdfiles.com/local--files/tiamat/Tiamat.jpg', 30, 3, '', 'Dragon', 19, 7, 20, 11, 0)

    INSERT INTO [dbo].[NonPlayerCharacters]
        ([Name], [HitPoints], [ArmorClass], [Description], [ImageUrl], [MoveSpeed], [OwnerId], [CharacterRace], [CharacterType], [PassivePerception], [InitiativeModifier], [SpellSaveDC], [ChallengeRating], [IsDeleted])
    VALUES
        ('Gelatinous Cube', 125, 12, 'Sure is clean around here', 'http://nerdreactor.com/wp-content/uploads/2013/04/Gelatinous-Cube.jpg', 25, 2, '', 'Construct', 8, 0, NULL, 2.75, 0)
END

-- Encounters
BEGIN
    USE [DMInsights]
    INSERT INTO [dbo].[Encounters]
        ([DateCreated], GameSessionId)
    VALUES
        ('2018-09-25 13:16:58', 1)

    INSERT INTO [dbo].[Encounters]
        ([DateCreated], GameSessionId)
    VALUES
        ('2019-01-10 07:36:45', 2)

    INSERT INTO [dbo].[Encounters]
        ([DateCreated], GameSessionId)
    VALUES
        ('2018-12-09 14:07:38', 3)

    INSERT INTO [dbo].[Encounters]
        ([DateCreated], GameSessionId)
    VALUES
        ('2019-04-01 05:42:41', 4)

    INSERT INTO [dbo].[Encounters]
        ([DateCreated], GameSessionId)
    VALUES
        ('2018-12-14 22:38:40', 5)

    INSERT INTO [dbo].[Encounters]
        ([DateCreated], GameSessionId)
    VALUES
        ('2018-12-18 22:27:00', 1)

    INSERT INTO [dbo].[Encounters]
        ([DateCreated], GameSessionId)
    VALUES
        ('2019-06-18 03:55:16', 2)

    INSERT INTO [dbo].[Encounters]
        ([DateCreated], GameSessionId)
    VALUES
        ('2019-06-07 00:43:41', 1)
END

-- EncounterPlayerCharacters
BEGIN
    USE [DMInsights]
    INSERT INTO [dbo].EncounterPlayerCharacters
        ([CharacterId], [CurrentHP], [EncounterId], [Initiative], [Notes], [StatusEffects])
    VALUES
        (2, 76, 3, 15, NULL, 'Poisoned')

    INSERT INTO [dbo].EncounterPlayerCharacters
        ([CharacterId], [CurrentHP], [EncounterId], [Initiative], [Notes], [StatusEffects])
    VALUES
        (2, 45, 5, 12, 'Party almost wiped', NULL)

    INSERT INTO [dbo].EncounterPlayerCharacters
        ([CharacterId], [CurrentHP], [EncounterId], [Initiative], [Notes], [StatusEffects])
    VALUES
        (3, 18, 2, 10, NULL, NULL)

    INSERT INTO [dbo].EncounterPlayerCharacters
        ([CharacterId], [CurrentHP], [EncounterId], [Initiative], [Notes], [StatusEffects])
    VALUES
        (3, 7, 7, 18, 'Jumped by Kobolds', NULL)

    INSERT INTO [dbo].EncounterPlayerCharacters
        ([CharacterId], [CurrentHP], [EncounterId], [Initiative], [Notes], [StatusEffects])
    VALUES
        (4, 52, 1, 13, NULL, NULL)

    INSERT INTO [dbo].EncounterPlayerCharacters
        ([CharacterId], [CurrentHP], [EncounterId], [Initiative], [Notes], [StatusEffects])
    VALUES
        (6, 56, 1, 15, NULL, NULL)

    INSERT INTO [dbo].EncounterPlayerCharacters
        ([CharacterId], [CurrentHP], [EncounterId], [Initiative], [Notes], [StatusEffects])
    VALUES
        (4, 34, 6, 13, NULL, NULL)

    INSERT INTO [dbo].EncounterPlayerCharacters
        ([CharacterId], [CurrentHP], [EncounterId], [Initiative], [Notes], [StatusEffects])
    VALUES
        (6, 70, 6, 15, NULL, NULL)

    INSERT INTO [dbo].EncounterPlayerCharacters
        ([CharacterId], [CurrentHP], [EncounterId], [Initiative], [Notes], [StatusEffects])
    VALUES
        (4, 34, 8, 13, NULL, NULL)

    INSERT INTO [dbo].EncounterPlayerCharacters
        ([CharacterId], [CurrentHP], [EncounterId], [Initiative], [Notes], [StatusEffects])
    VALUES
        (6, 70, 8, 15, NULL, NULL)

    INSERT INTO [dbo].EncounterPlayerCharacters
        ([CharacterId], [CurrentHP], [EncounterId], [Initiative], [Notes], [StatusEffects])
    VALUES
        (4, 34, 4, 13, NULL, NULL)

    INSERT INTO [dbo].EncounterPlayerCharacters
        ([CharacterId], [CurrentHP], [EncounterId], [Initiative], [Notes], [StatusEffects])
    VALUES
        (6, 70, 4, 15, NULL, NULL)
END

-- EncounterNonPlayerCharacters
BEGIN
    USE [DMInsights]
    INSERT INTO [dbo].EncounterNonPlayerCharacters
        ([NpcCharacterId], [CurrentHP], [EncounterId], [Inititaive], [Notes], [StatusEffects], [SledDesignation])
    VALUES
    (1, 0, 1, 13, 'The players executed the monster', NULL, 1)

    INSERT INTO [dbo].EncounterNonPlayerCharacters
        ([NpcCharacterId], [CurrentHP], [EncounterId], [Inititaive], [Notes], [StatusEffects], [SledDesignation])
    VALUES
    (1, 0, 1, 14, NULL, NULL, 2)

    INSERT INTO [dbo].EncounterNonPlayerCharacters
        ([NpcCharacterId], [CurrentHP], [EncounterId], [Inititaive], [Notes], [StatusEffects], [SledDesignation])
    VALUES
    (1, 0, 1, 8, NULL, NULL, 3)

    INSERT INTO [dbo].EncounterNonPlayerCharacters
        ([NpcCharacterId], [CurrentHP], [EncounterId], [Inititaive], [Notes], [StatusEffects], [SledDesignation])
    VALUES
    (5, 0, 1, 17, NULL, NULL, 4)

    INSERT INTO [dbo].EncounterNonPlayerCharacters
        ([NpcCharacterId], [CurrentHP], [EncounterId], [Inititaive], [Notes], [StatusEffects], [SledDesignation])
    VALUES
    (2, 0, 2, 16, 'The players executed the monster', NULL, 1)

    INSERT INTO [dbo].EncounterNonPlayerCharacters
        ([NpcCharacterId], [CurrentHP], [EncounterId], [Inititaive], [Notes], [StatusEffects], [SledDesignation])
    VALUES
    (3, 0, 2, 3, 'The players executed the monster', NULL, 2)

    INSERT INTO [dbo].EncounterNonPlayerCharacters
        ([NpcCharacterId], [CurrentHP], [EncounterId], [Inititaive], [Notes], [StatusEffects], [SledDesignation])
    VALUES
    (4, 123, 3, 19, 'Tiamat', NULL, 1)

    INSERT INTO [dbo].EncounterNonPlayerCharacters
        ([NpcCharacterId], [CurrentHP], [EncounterId], [Inititaive], [Notes], [StatusEffects], [SledDesignation])
    VALUES
    (5, 0, 5, 11, NULL, NULL, 1)

END
COMMIT TRANSACTION DMI_SEED
