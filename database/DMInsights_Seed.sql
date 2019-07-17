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
        ALTER DATABASE [DMInsights] SET SINGLE_USER WITH ROLLBACK IMMEDIATE
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

BEGIN TRANSACTION QUICKDBD

CREATE TABLE [Users] (
    [Id] int IDENTITY(1,1) NOT NULL ,
    [FirstName] nvarchar(255)  NOT NULL ,
    [LastName] nvarchar(255)  NOT NULL ,
    [UserName] nvarchar(255)  NOT NULL ,
    [IdToken] nvarchar(255)  NOT NULL ,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED (
        [Id] ASC
    )
)

CREATE TABLE [Campaigns] (
    [Id] int IDENTITY(1,1) NOT NULL ,
    [Title] nvarchar(255)  NOT NULL ,
    [Description] nvarchar(255)  NOT NULL ,
    [ConnectionID] UNIQUEIDENTIFIER  NOT NULL ,
    [OwnerId] int  NOT NULL ,
    CONSTRAINT [PK_Campaigns] PRIMARY KEY CLUSTERED (
        [Id] ASC
    )
)

CREATE TABLE [CampaignsUsers] (
    [UserId] int  NOT NULL ,
    [CampaignId] int  NOT NULL 
)

CREATE TABLE [PlayerCharacters] (
    [Id] int IDENTITY(1,1) NOT NULL ,
    [HitPoints] int  NOT NULL ,
    [ArmorClass] int  NOT NULL ,
    [Description] nvarchar(255)  NOT NULL ,
    [ImageUrl] nvarchar(255)  NOT NULL ,
    [MoveSpeed] int  NOT NULL ,
    [OwnerId] int  NOT NULL ,
    [CharacterRace] nvarchar(255)  NOT NULL ,
    [CharacterType] nvarchar(255)  NOT NULL ,
    [PassivePerception] int  NOT NULL ,
    [InitiativeModifier] int  NOT NULL ,
    [SpellSaveDC] int  NOT NULL ,
    [Classes] nvarchar(255)  NOT NULL ,
    [Level] int  NOT NULL ,
    [CampaignId] int  NOT NULL ,
    CONSTRAINT [PK_PlayerCharacters] PRIMARY KEY CLUSTERED (
        [Id] ASC
    )
)

CREATE TABLE [NonPlayerCharacters] (
    [Id] int IDENTITY(1,1) NOT NULL ,
    [HitPoints] int  NOT NULL ,
    [ArmorClass] int  NOT NULL ,
    [Description] nvarchar(255)  NOT NULL ,
    [ImageUrl] nvarchar(255)  NOT NULL ,
    [MoveSpeed] int  NOT NULL ,
    [OwnerId] int  NOT NULL ,
    [CharacterRace] nvarchar(255)  NOT NULL ,
    [CharacterType] nvarchar(255)  NOT NULL ,
    [PassivePerception] int  NOT NULL ,
    [InitiativeModifier] int  NOT NULL ,
    [SpellSaveDC] int  NOT NULL ,
    [ChallengeRating] int  NOT NULL ,
    CONSTRAINT [PK_NonPlayerCharacters] PRIMARY KEY CLUSTERED (
        [Id] ASC
    )
)

CREATE TABLE [GameSessions] (
    [Id] int IDENTITY(1,1) NOT NULL ,
    [Title] nvarchar(255)  NOT NULL ,
    [Description] nvarchar(255)  NOT NULL ,
    [CampaignId] int  NOT NULL ,
    [OwnerId] int  NOT NULL ,
    [DateTime] datetime  NOT NULL ,
    CONSTRAINT [PK_GameSessions] PRIMARY KEY CLUSTERED (
        [Id] ASC
    )
)

CREATE TABLE [GameSessionPlayerCharacters] (
    [PlayerCharacterId] int  NOT NULL ,
    [GameSessionId] int  NOT NULL 
)

CREATE TABLE [Encounters] (
    [Id] int IDENTITY(1,1) NOT NULL ,
    [DateTime] datetime  NOT NULL ,
    [GameSessionId] int  NOT NULL ,
    CONSTRAINT [PK_Encounters] PRIMARY KEY CLUSTERED (
        [Id] ASC
    )
)

CREATE TABLE [EncounterPlayerCharacters] (
    [Id] int IDENTITY(1,1) NOT NULL ,
    [CharacterId] int  NOT NULL ,
    [CurrentHP] int  NOT NULL ,
    [EncounterId] int  NOT NULL ,
    [Initiative] int  NOT NULL ,
    [Notes] nvarchar(max)  NOT NULL ,
    [StatusEffects] nvarchar(255)  NOT NULL ,
    CONSTRAINT [PK_EncounterPlayerCharacters] PRIMARY KEY CLUSTERED (
        [Id] ASC
    )
)

CREATE TABLE [EncounterNonPlayerCharacters] (
    [Id] int IDENTITY(1,1) NOT NULL ,
    [CharacterId] int  NOT NULL ,
    [CurrentHP] int  NOT NULL ,
    [EncounterId] int  NOT NULL ,
    [Inititaive] int  NOT NULL ,
    [Notes] nvarchar(max)  NOT NULL ,
    [StatusEffects] nvarchar(255)  NOT NULL ,
    [SledDesignation] int  NOT NULL ,
    CONSTRAINT [PK_EncounterNonPlayerCharacters] PRIMARY KEY CLUSTERED (
        [Id] ASC
    )
)

ALTER TABLE [Campaigns] WITH CHECK ADD CONSTRAINT [FK_Campaigns_OwnerId] FOREIGN KEY([OwnerId])
REFERENCES [Users] ([Id])

ALTER TABLE [Campaigns] CHECK CONSTRAINT [FK_Campaigns_OwnerId]

ALTER TABLE [CampaignsUsers] WITH CHECK ADD CONSTRAINT [FK_CampaignsUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [Users] ([Id])

ALTER TABLE [CampaignsUsers] CHECK CONSTRAINT [FK_CampaignsUsers_UserId]

ALTER TABLE [CampaignsUsers] WITH CHECK ADD CONSTRAINT [FK_CampaignsUsers_CampaignId] FOREIGN KEY([CampaignId])
REFERENCES [Campaigns] ([Id])

ALTER TABLE [CampaignsUsers] CHECK CONSTRAINT [FK_CampaignsUsers_CampaignId]

ALTER TABLE [PlayerCharacters] WITH CHECK ADD CONSTRAINT [FK_PlayerCharacters_OwnerId] FOREIGN KEY([OwnerId])
REFERENCES [Users] ([Id])

ALTER TABLE [PlayerCharacters] CHECK CONSTRAINT [FK_PlayerCharacters_OwnerId]

ALTER TABLE [PlayerCharacters] WITH CHECK ADD CONSTRAINT [FK_PlayerCharacters_CampaignId] FOREIGN KEY([CampaignId])
REFERENCES [Campaigns] ([Id])

ALTER TABLE [PlayerCharacters] CHECK CONSTRAINT [FK_PlayerCharacters_CampaignId]

ALTER TABLE [NonPlayerCharacters] WITH CHECK ADD CONSTRAINT [FK_NonPlayerCharacters_OwnerId] FOREIGN KEY([OwnerId])
REFERENCES [Users] ([Id])

ALTER TABLE [NonPlayerCharacters] CHECK CONSTRAINT [FK_NonPlayerCharacters_OwnerId]

ALTER TABLE [GameSessions] WITH CHECK ADD CONSTRAINT [FK_GameSessions_CampaignId] FOREIGN KEY([CampaignId])
REFERENCES [Campaigns] ([Id])

ALTER TABLE [GameSessions] CHECK CONSTRAINT [FK_GameSessions_CampaignId]

ALTER TABLE [GameSessions] WITH CHECK ADD CONSTRAINT [FK_GameSessions_OwnerId] FOREIGN KEY([OwnerId])
REFERENCES [Users] ([Id])

ALTER TABLE [GameSessions] CHECK CONSTRAINT [FK_GameSessions_OwnerId]

ALTER TABLE [GameSessionPlayerCharacters] WITH CHECK ADD CONSTRAINT [FK_GameSessionPlayerCharacters_PlayerCharacterId] FOREIGN KEY([PlayerCharacterId])
REFERENCES [PlayerCharacters] ([Id])

ALTER TABLE [GameSessionPlayerCharacters] CHECK CONSTRAINT [FK_GameSessionPlayerCharacters_PlayerCharacterId]

ALTER TABLE [GameSessionPlayerCharacters] WITH CHECK ADD CONSTRAINT [FK_GameSessionPlayerCharacters_GameSessionId] FOREIGN KEY([GameSessionId])
REFERENCES [GameSessions] ([Id])

ALTER TABLE [GameSessionPlayerCharacters] CHECK CONSTRAINT [FK_GameSessionPlayerCharacters_GameSessionId]

ALTER TABLE [Encounters] WITH CHECK ADD CONSTRAINT [FK_Encounters_GameSessionId] FOREIGN KEY([GameSessionId])
REFERENCES [GameSessions] ([Id])

ALTER TABLE [Encounters] CHECK CONSTRAINT [FK_Encounters_GameSessionId]

ALTER TABLE [EncounterPlayerCharacters] WITH CHECK ADD CONSTRAINT [FK_EncounterPlayerCharacters_CharacterId] FOREIGN KEY([CharacterId])
REFERENCES [PlayerCharacters] ([Id])

ALTER TABLE [EncounterPlayerCharacters] CHECK CONSTRAINT [FK_EncounterPlayerCharacters_CharacterId]

ALTER TABLE [EncounterPlayerCharacters] WITH CHECK ADD CONSTRAINT [FK_EncounterPlayerCharacters_EncounterId] FOREIGN KEY([EncounterId])
REFERENCES [Encounters] ([Id])

ALTER TABLE [EncounterPlayerCharacters] CHECK CONSTRAINT [FK_EncounterPlayerCharacters_EncounterId]

ALTER TABLE [EncounterNonPlayerCharacters] WITH CHECK ADD CONSTRAINT [FK_EncounterNonPlayerCharacters_Id] FOREIGN KEY([Id])
REFERENCES [NonPlayerCharacters] ([Id])

ALTER TABLE [EncounterNonPlayerCharacters] CHECK CONSTRAINT [FK_EncounterNonPlayerCharacters_Id]

ALTER TABLE [EncounterNonPlayerCharacters] WITH CHECK ADD CONSTRAINT [FK_EncounterNonPlayerCharacters_EncounterId] FOREIGN KEY([EncounterId])
REFERENCES [Encounters] ([Id])

ALTER TABLE [EncounterNonPlayerCharacters] CHECK CONSTRAINT [FK_EncounterNonPlayerCharacters_EncounterId]

COMMIT TRANSACTION QUICKDBD