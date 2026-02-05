-- =============================================
-- Stored Procedure: usp_DeleteCETApp
-- Description: Deletes a CET application record by ID
-- Parameters: @AppId - The application ID to delete
-- Returns: Number of rows affected (1 if deleted, 0 if not found)
-- Created: 2026-01-17
-- =============================================
CREATE PROCEDURE dbo.usp_DeleteCETApp
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

        -- Delete the application record
        DELETE FROM dbo.CETApps
        WHERE id = @AppId;

        -- Return number of rows affected
        SELECT @@ROWCOUNT AS RowsAffected;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
