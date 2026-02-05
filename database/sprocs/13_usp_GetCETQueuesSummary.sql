-- =============================================
-- Stored Procedure: usp_GetCETQueuesSummary
-- Description: Retrieves CET queues summary data
-- Returns: Summary of all queues and their message counts
-- Created: 2026-01-17
-- =============================================
CREATE PROCEDURE dbo.usp_GetCETQueuesSummary
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
            id,
            app,
            appName,
            queue,
            status,
            messages
        FROM 
            dbo.CETQueuesSummary
        ORDER BY 
            app,
            queue;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
