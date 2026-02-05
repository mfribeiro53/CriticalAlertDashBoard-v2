-- =============================================
-- Stored Procedure: usp_GetCETAppById
-- Description: Retrieves a single CET application by ID
-- Parameters: @AppId - The application ID to retrieve
-- Returns: Single CET application record or empty if not found
-- Created: 2026-01-17
-- =============================================
CREATE PROCEDURE dbo.usp_GetCETAppById
    @AppId INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Validate input parameter
        IF @AppId IS NULL
        BEGIN
            RAISERROR('Parameter @AppId cannot be NULL', 16, 1);
            RETURN;
        END

        -- Retrieve specific app by ID
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
