-- =============================================
-- Stored Procedure: usp_CreateCETApp
-- Description: Creates a new CET application record
-- Parameters: All application fields except id (auto-generated)
-- Returns: The newly created application record
-- Created: 2026-01-17
-- =============================================
CREATE PROCEDURE dbo.usp_CreateCETApp
    @iGateApp NVARCHAR(100),
    @cetApp NVARCHAR(255),
    @sqlServer NVARCHAR(100),
    @database_name NVARCHAR(100),
    @description NVARCHAR(500) = NULL,
    @supportLink NVARCHAR(500) = NULL,
    @status NVARCHAR(50) = 'active',
    @environment NVARCHAR(50) = 'production'
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Validate required parameters
        IF @iGateApp IS NULL OR @cetApp IS NULL OR @sqlServer IS NULL OR @database_name IS NULL
        BEGIN
            RAISERROR('Required parameters cannot be NULL: iGateApp, cetApp, sqlServer, database_name', 16, 1);
            RETURN;
        END

        -- Generate new ID (get max ID + 1)
        DECLARE @NewId INT;
        SELECT @NewId = ISNULL(MAX(id), 0) + 1 FROM dbo.CETApps;

        -- Insert new application record
        INSERT INTO dbo.CETApps (
            id,
            iGateApp,
            cetApp,
            sqlServer,
            database_name,
            description,
            supportLink,
            status,
            environment,
            lastUpdated
        )
        VALUES (
            @NewId,
            @iGateApp,
            @cetApp,
            @sqlServer,
            @database_name,
            @description,
            @supportLink,
            @status,
            @environment,
            GETDATE()
        );

        -- Return the newly created record
        SELECT 
            id,
            iGateApp,
            cetApp,
            sqlServer,
            database_name,
            description,
            supportLink,
            status,
            environment,
            lastUpdated
        FROM 
            dbo.CETApps
        WHERE 
            id = @NewId;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
