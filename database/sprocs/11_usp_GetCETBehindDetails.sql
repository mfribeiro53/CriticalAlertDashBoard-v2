-- =============================================
-- Stored Procedure: usp_GetCETBehindDetails
-- Description: Retrieves behind process detail records
-- Returns: All behind process detail records
-- Created: 2026-01-17
-- =============================================
CREATE PROCEDURE dbo.usp_GetCETBehindDetails
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
            dbo.CETBehindDetails
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
