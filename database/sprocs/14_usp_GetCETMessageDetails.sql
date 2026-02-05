-- =============================================
-- Stored Procedure: usp_GetCETMessageDetails
-- Description: Retrieves message detail records for queues
-- Returns: All message detail records
-- Created: 2026-01-17
-- =============================================
CREATE PROCEDURE dbo.usp_GetCETMessageDetails
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
            id,
            queueId,
            queue,
            messageEnqueueTime,
            criticalSection
        FROM 
            dbo.CETMessageDetails
        ORDER BY 
            queueId,
            messageEnqueueTime;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
