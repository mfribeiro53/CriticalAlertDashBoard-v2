-- =============================================
-- Stored Procedure: usp_UpdateCETApp
-- Description: Updates an existing CET application record
-- Parameters: @AppId and all updatable application fields
-- Returns: The updated application record or empty if not found
-- Created: 2026-01-17
-- =============================================
CREATE PROCEDURE dbo.usp_UpdateCETApp
    @AppId INT,
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
        IF @AppId IS NULL OR @iGateApp IS NULL OR @cetApp IS NULL OR @sqlServer IS NULL OR @database_name IS NULL
        BEGIN
            RAISERROR('Required parameters cannot be NULL: AppId, iGateApp, cetApp, sqlServer, database_name', 16, 1);
            RETURN;
        END

        -- Check if record exists
        IF NOT EXISTS (SELECT 1 FROM dbo.CETApps WHERE id = @AppId)
        BEGIN
            RAISERROR('Application with ID %d not found', 16, 1, @AppId);
            RETURN;
        END

        -- Update the application record
        UPDATE dbo.CETApps
        SET 
            iGateApp = @iGateApp,
            cetApp = @cetApp,
            sqlServer = @sqlServer,
            database_name = @database_name,
            description = @description,
            supportLink = @supportLink,
            status = @status,
            environment = @environment,
            lastUpdated = GETDATE()
        WHERE 
            id = @AppId;

        -- Return the updated record
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
            id = @AppId;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
