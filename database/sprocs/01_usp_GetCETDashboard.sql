-- =============================================
-- Stored Procedure: usp_GetCETDashboard
-- Description: Retrieves all CET Dashboard summary data
-- 
-- Returns: Complete dashboard metrics for all applications
-- 
-- Created: 2026-01-17
-- =============================================

-- Drop existing procedure if it exists
IF OBJECT_ID('dbo.usp_GetCETDashboard', 'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_GetCETDashboard;
GO

CREATE PROCEDURE dbo.usp_GetCETDashboard
AS
BEGIN
    -- SET NOCOUNT ON to prevent extra result sets from interfering with SELECT statements
    SET NOCOUNT ON;

    -- Error handling
    BEGIN TRY
        -- Retrieve all dashboard data ordered by iGateApp and cetApp
        SELECT 
            id,
            iGateApp,
            cetApp,
            messages,
            issues,
            alerts,
            disabledQueues,
            processesBehind,
            slow,
            status,
            lastUpdated
        FROM 
            dbo.CETDashboard
        ORDER BY 
            iGateApp,
            cetApp;

    END TRY
    BEGIN CATCH
        -- Return error information
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO

-- Grant execute permissions
GRANT EXECUTE ON dbo.usp_GetCETDashboard TO nodejs_user;
GO

-- Test the stored procedure
EXEC dbo.usp_GetCETDashboard;
GO