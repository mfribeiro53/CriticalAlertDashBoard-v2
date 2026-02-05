-- =============================================
-- Stored Procedure: usp_GetCETAlertDetails
-- Description: Retrieves detailed alert records
-- Returns: All alert detail records
-- Created: 2026-01-17
-- =============================================
CREATE PROCEDURE dbo.usp_GetCETAlertDetails
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
            id,
            application,
            step,
            subStep,
            criticalSection,
            criticalSectionDate,
            time,
            alert
        FROM 
            dbo.CETAlertDetails
        ORDER BY 
            application,
            step,
            subStep,
            criticalSection;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
