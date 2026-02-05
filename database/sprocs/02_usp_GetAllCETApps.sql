-- =============================================
-- Stored Procedure: usp_GetAllCETApps
-- Description: Retrieves all CET applications
-- Returns: All CET application records ordered by iGateApp and cetApp
-- Created: 2026-01-17
-- =============================================
CREATE PROCEDURE dbo.usp_GetAllCETApps
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Retrieve all CET apps ordered by iGateApp and cetApp
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
        ORDER BY 
            iGateApp,
            cetApp;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
