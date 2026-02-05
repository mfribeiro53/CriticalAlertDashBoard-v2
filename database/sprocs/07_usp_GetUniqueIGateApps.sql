-- =============================================
-- Stored Procedure: usp_GetUniqueIGateApps
-- Description: Retrieves distinct iGateApp values
-- Returns: List of unique iGateApp names sorted alphabetically
-- Created: 2026-01-17
-- =============================================
CREATE PROCEDURE dbo.usp_GetUniqueIGateApps
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Retrieve distinct iGateApp values
        SELECT DISTINCT 
            iGateApp
        FROM 
            dbo.CETApps
        ORDER BY 
            iGateApp;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
