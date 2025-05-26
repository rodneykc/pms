Function GenerateFormURL() As String
    Dim url As String
    Dim fname As String
    Dim lname As String
    Dim pid As Long
    Dim globaldays As Long
    Dim pc_eventDate As Date
    Dim LastEM As Variant
    Dim LastSurg As Variant
    Dim DOB As Date
    Dim pc_hometext As String
    Dim Communication2Clinic As String
    Dim ClinicCollectAmt As Currency
    Dim provider As String
    'Dim consent As String
    Dim id_card As String
    Dim payor As String
    Dim email As String
    Dim street_new As String
    Dim city As String
    Dim state as String
    Dim postal As String
    Dim cellphone As String
    Dim medicalhistory As String
    Dim surgicalhistory As String
    Dim medications As String
    Dim allergies As String
    Dim icd10 As String
    Dim intake_status As String
    Dim consent_status As String
    Dim userResponse As VbMsgBoxResult

    ' Replace these with actual references to your form/table/fields
    fname = [Forms]![frm_clinicprep]![fname]
    lname = [Forms]![frm_clinicprep]![lname]
    pid = [Forms]![frm_clinicprep]![pid]
    pc_eventDate = [Forms]![frm_clinicprep]![pc_eventDate]
    DOB = [Forms]![frm_clinicprep]![DOB]
    pc_hometext = [Forms]![frm_clinicprep]![pc_hometext]
    provider = [Forms]![frm_clinicprep]![provider]
    email = [Forms]![frm_clinicprep]![email]
    street_new = [Forms]![frm_clinicprep]![street]
    city = [Forms]![frm_clinicprep]![city]
    state = [Forms]![frm_clinicprep]![state]
    postal = [Forms]![frm_clinicprep]![postal_code]
    cellphone = [Forms]![frm_clinicprep]![phone_cell]
    medicalhistory = Nz([Forms]![frm_clinicprep]![ConcatenatedTitles_MedProb],"")
    surgicalhistory = Nz([Forms]![frm_clinicprep]![ConcatenatedTitles_Surgery],"")
    medications = Nz([Forms]![frm_clinicprep]![ConcatenatedTitles_Meds],"")
    allergies = URLEncode(Nz([Forms]![frm_clinicprep]![ConcatenatedTitles_Allergy], ""))
    icd10 = Nz([Forms]![frm_clinicprep]![ConcatenatedICDs],"")
    globaldays = Nz([Forms]![frm_clinicprep]![MaxOfgb])
    LastEM = [Forms]![frm_clinicprep]![LastEM]
    LastSurg = [Forms]![frm_clinicprep]![LastSurg]
    intake_status = [Forms]![frm_clinicprep]![intake_status_final]
    consent_status = [Forms]![frm_clinicprep]![rx_consent_status_final]

    ' Check if subform exists and has data
    If [Forms]![frm_clinicprep]![tbl_clinicprep2 subform].Form.RecordsetClone.RecordCount > 0 Then
        Communication2Clinic = Nz([Forms]![frm_clinicprep]![tbl_clinicprep2 subform]![communication], "")
        ClinicCollectAmt = Nz([Forms]![frm_clinicprep]![tbl_clinicprep2 subform]![clinic_collect_amt], 0)
        'consent = Nz([Forms]![frm_clinicprep]![tbl_clinicprep2 subform]![consent], "")
        id_card = Nz([Forms]![frm_clinicprep]![tbl_clinicprep2 subform]![id_card], "")
        payor = Nz([Forms]![frm_clinicprep]![tbl_clinicprep2 subform]![payor], "")
    Else
        ' If subform is not available, prompt the user
        userResponse = MsgBox("The subform is not available. Would you like to proceed with default values, or go back and complete the subform?" & vbCrLf & vbCrLf & "Click 'Yes' to proceed with default values." & vbCrLf & "Click 'No' to return and complete the subform.", vbYesNo + vbQuestion, "Subform Missing")

        If userResponse = vbNo Then
            ' If the user chooses to go back and complete the subform, exit the function
            MsgBox "Please complete the subform before proceeding.", vbInformation, "Action Required"
            Exit Function
        Else
            ' Proceed with default values if the user chooses 'Yes'
            Communication2Clinic = ""
            ClinicCollectAmt = 0
            'consent = ""
            id_card = ""
            payor = ""
        End If
    End If

    ' Build the URL string
    url = "https://form.jotform.com/243087164429360?patient[first]=" & fname & _
          "&patient[last]=" & lname & _
          "&patientOpenemr=" & pid & _
          "&dateOf[month]=" & Month(pc_eventDate) & _
          "&dateOf[day]=" & DatePart("d", pc_eventDate) & _
          "&dateOf[year]=" & Year(pc_eventDate) & _
          "&dob[month]=" & Month(DOB) & _
          "&dob[day]=" & DatePart("d", DOB) & _
          "&dob[year]=" & Year(DOB) & _
          "&dateOf7[month]=" & Month(LastSurg) & "&dateOf7[day]=" & DatePart("d", LastSurg) & "&dateOf7[year]=" & Year(LastSurg) & _
          "&dateOf10[month]=" & Month(LastEM) & "&dateOf10[day]=" & DatePart("d", LastEM) & "&dateOf10[year]=" & Year(LastEM) & _
          "&provider20=" & provider & _
          "&intake27=" & intake_status & "&consent28=" & consent_status & _
          "&payor=" & payor & _
          "&idCard29=" & id_card & _
          "&email=" & email & _
          "&globalPeriod30=" & globaldays & _
          "&icd10=" & icd10 & _
          "&medicalHistory=" & medicalhistory & "&surgicalHistory=" & surgicalhistory & "&medications=" & medications & "&allergies=" & allergies & _
          "&address[addr_line1]=" & street_new & "&address[city]=" & city & "&address[state]=" & state & "&address[postal]=" & postal & "&mobile=" & cellphone & _
          "&purposeOf=" & pc_hometext & _
          "&internalNotes=" & Communication2Clinic & _
          "&amountOwed=" & ClinicCollectAmt

    ' Return the generated URL
    GenerateFormURL = url
End Function

Sub OpenGeneratedFormURL()
    Dim url As String
    url = GenerateFormURL()
    
    ' Use FollowHyperlink to open the URL in the default web browser
    Application.FollowHyperlink url
End Sub

Function ConcatenateTitlesByType(pid As Long, TypeValue As String) As String
    Dim db As DAO.Database
    Dim rs As DAO.Recordset
    Dim result As String
    Dim separator As String

    Set db = CurrentDb()
    Set rs = db.OpenRecordset("SELECT title FROM tmptbl_lists WHERE pid = " & pid & " AND type = '" & TypeValue & "'")
    
    separator = " | "  ' Separator between titles
    result = ""
    
    Do While Not rs.EOF
        If Len(result) > 0 Then
            result = result & separator
        End If
        result = result & rs!title
        rs.MoveNext
    Loop
    
    rs.Close
    Set rs = Nothing
    Set db = Nothing
    
    ConcatenateTitlesByType = result
End Function

Function ConcatenateICDs(pid As Long) As String
    Dim db As DAO.Database
    Dim rs As DAO.Recordset
    Dim result As String
    Dim separator As String
    
    Set db = CurrentDb()
    Set rs = db.OpenRecordset("SELECT icd FROM qry_pid_icd10 WHERE pid_val = " & pid)
    
    separator = " | "  ' Separator between ICD values
    result = ""
    
    Do While Not rs.EOF
        If Len(result) > 0 Then
            result = result & separator
        End If
        result = result & rs!icd
        rs.MoveNext
    Loop
    
    rs.Close
    Set rs = Nothing
    Set db = Nothing
    
    ConcatenateICDs = result
End Function

Function URLEncode(ByVal str As String) As String
    Dim i As Integer
    Dim charCode As Integer
    Dim encodedStr As String

    For i = 1 To Len(str)
        charCode = Asc(Mid(str, i, 1))
        
        Select Case charCode
            Case 48 To 57, 65 To 90, 97 To 122  ' 0-9, A-Z, a-z
                encodedStr = encodedStr & Chr(charCode)
            Case 32
                encodedStr = encodedStr & "%20"
            Case Else
                encodedStr = encodedStr & "%" & Right("0" & Hex(charCode), 2)
        End Select
    Next i

    URLEncode = encodedStr
End Function