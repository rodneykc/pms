UnionTable = 
UNION(
    SELECTCOLUMNS(
        Bill_Account_Based_Expense_Line,
        "Transaction_Date", LOOKUPVALUE(Bill[Transaction_Date], Bill[Id], Bill_Account_Based_Expense_Line[Id]),
        "VendorRef_Name", LOOKUPVALUE(Bill[VendorRef_Name], Bill[Id], Bill_Account_Based_Expense_Line[Id]),
        "Line_Amount", Bill_Account_Based_Expense_Line[Line_Amount],
        "Line_Detail_CustomerRef_Value", Bill_Account_Based_Expense_Line[Line_Detail_CustomerRef_Value],
        "Line_Detail_ClassRef_Value", Bill_Account_Based_Expense_Line[Line_Detail_ClassRef_Value],
        "Source", "Bill"
    ),
    SELECTCOLUMNS(
        Purchase_Account_Based_Expense_Line,
        "Transaction_Date", LOOKUPVALUE(Purchase[Transaction_Date], Purchase[Id], Purchase_Account_Based_Expense_Line[Id]),
        "VendorRef_Name", LOOKUPVALUE(Purchase[Private_Note], Purchase[Id], Purchase_Account_Based_Expense_Line[Id]),
        "Line_Amount", Purchase_Account_Based_Expense_Line[Line_Amount],
        "Line_Detail_CustomerRef_Value", Purchase_Account_Based_Expense_Line[Line_Detail_CustomerRef_Value],
        "Line_Detail_ClassRef_Value", Purchase_Account_Based_Expense_Line[Line_Detail_ClassRef_Value],
        "Source", "Purchase"
    ),
    SELECTCOLUMNS(
        FILTER(
            JournalEntry_Line,
            (JournalEntry_Line[Line_Detail_AccountRef_Value] IN {"111", "99"})
        ),
        "Transaction_Date", LOOKUPVALUE(Journal_Entry[Transaction_Date], Journal_Entry[Id], JournalEntry_Line[Id]),
        "VendorRef_Name", LOOKUPVALUE(Account[Fully_Qualified_Name], Account[Id], JournalEntry_Line[Line_Detail_AccountRef_Value]) & "-" & JournalEntry_Line[Line_Description],
        "Line_Amount", JournalEntry_Line[Line_Amount],
        "Line_Detail_CustomerRef_Value", JournalEntry_Line[Line_Detail_Entity_EntityRef_Value],
        "Line_Detail_ClassRef_Value", JournalEntry_Line[Line_Detail_ClassRef_Value],        
        "Source", "Payroll"
    ),
    SELECTCOLUMNS(
        FILTER(
            JournalEntry_Line,
            (JournalEntry_Line[Line_Detail_AccountRef_Value] IN {"132"})
        ),
        "Transaction_Date", LOOKUPVALUE(Journal_Entry[Transaction_Date], Journal_Entry[Id], JournalEntry_Line[Id]),
        "VendorRef_Name", LOOKUPVALUE(Account[Fully_Qualified_Name], Account[Id], JournalEntry_Line[Line_Detail_AccountRef_Value]) & "-" & JournalEntry_Line[Line_Description],
        "Line_Amount", JournalEntry_Line[Line_Amount],
        "Line_Detail_CustomerRef_Value", JournalEntry_Line[Line_Detail_Entity_EntityRef_Value],
        "Line_Detail_ClassRef_Value", JournalEntry_Line[Line_Detail_ClassRef_Value],   
        "Source", "Fringe"
    ),
    SELECTCOLUMNS(
        FILTER(
            JournalEntry_Line,
            (JournalEntry_Line[Line_Detail_AccountRef_Value] IN {"133"})
        ),
        "Transaction_Date", LOOKUPVALUE(Journal_Entry[Transaction_Date], Journal_Entry[Id], JournalEntry_Line[Id]),
        "VendorRef_Name", LOOKUPVALUE(Account[Fully_Qualified_Name], Account[Id], JournalEntry_Line[Line_Detail_AccountRef_Value]) & "-" & JournalEntry_Line[Line_Description],
        "Line_Amount", JournalEntry_Line[Line_Amount],
        "Line_Detail_CustomerRef_Value", JournalEntry_Line[Line_Detail_Entity_EntityRef_Value],
        "Line_Detail_ClassRef_Value", JournalEntry_Line[Line_Detail_ClassRef_Value],   
        "Source", "Indirect"
    ),
    SELECTCOLUMNS(
        FILTER(
            JournalEntry_Line,
            NOT(JournalEntry_Line[Line_Detail_AccountRef_Value] IN {"101","111", "132", "133", "44", "88"})
        ),
        "Transaction_Date", LOOKUPVALUE(Journal_Entry[Transaction_Date], Journal_Entry[Id], JournalEntry_Line[Id]),
        "VendorRef_Name", LOOKUPVALUE(Account[Fully_Qualified_Name], Account[Id], JournalEntry_Line[Line_Detail_AccountRef_Value]) & "-" & JournalEntry_Line[Line_Description],
        "Line_Amount", JournalEntry_Line[Line_Amount],
        "Line_Detail_CustomerRef_Value", JournalEntry_Line[Line_Detail_Entity_EntityRef_Value],
        "Line_Detail_ClassRef_Value", JournalEntry_Line[Line_Detail_ClassRef_Value],   
        "Source", "Others"
    )
)