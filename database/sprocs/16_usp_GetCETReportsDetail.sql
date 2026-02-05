-- =============================================
-- Stored Procedure: usp_GetCETReportsDetail
-- Description: Retrieves CET reports detail data
-- Returns: All runs for each critical section
-- Created: 2026-01-17
-- =============================================
CREATE PROCEDURE dbo.usp_GetCETReportsDetail
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
            id,
            step,
            subStep,
            criticalSection,
            segmentDate,
            segmentTime,
            waitTime,
            startTime,
            endTime,
            duration,
            deletes,
            updates,
            inserts,
            lastUpdated
        FROM 
            dbo.CETReportsDetail
        ORDER BY 
            step,
            subStep,
            criticalSection,
            segmentDate DESC,
            segmentTime DESC;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
