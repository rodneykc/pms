Sub SaveForCLJ()
' SaveForCLJ Macro
    ChDir "C:\Users\rodne\OneDrive\Documents\Personal\Cases and Times"
    
    Sheets("CLJ New Timesheet").Select
    ActiveSheet.ExportAsFixedFormat Type:=xlTypePDF, Filename:= _
        "C:\Users\rodne\OneDrive\Documents\Personal\Cases and Times\CLJTimeSheet.pdf" _
        , Quality:=xlQualityStandard, IncludeDocProperties:=True, IgnorePrintAreas _
        :=False, OpenAfterPublish:=True
    
    Sheets("Detailed Timesheet").Select
    ActiveSheet.ExportAsFixedFormat Type:=xlTypePDF, Filename:= _
        "C:\Users\rodne\OneDrive\Documents\Personal\Cases and Times\DetailedTimesheet.pdf" _
        , Quality:=xlQualityStandard, IncludeDocProperties:=True, IgnorePrintAreas _
        :=False, OpenAfterPublish:=True
    
    Sheets("CLJ Invoice").Select
    ActiveSheet.ExportAsFixedFormat Type:=xlTypePDF, Filename:= _
        "C:\Users\rodne\OneDrive\Documents\Personal\Cases and Times\CLJInvoice.pdf" _
        , Quality:=xlQualityStandard, IncludeDocProperties:=True, IgnorePrintAreas _
        :=False, OpenAfterPublish:=True

End Sub
