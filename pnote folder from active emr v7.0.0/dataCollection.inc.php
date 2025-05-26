<?php

require_once("$srcdir/translation.inc.php");

/**
 * Return an array of list data for a given issue type and patient
 *
 * @var $pid string Patient ID
 * @var $type string Issue Type
 * @return
 */
function getListData($pid, $type)
{
    if ($type == "medication") {
        $sqlArr = [
            "SELECT lists.*, medications.list_id, medications.drug_dosage_instructions FROM lists",
            "LEFT JOIN ( SELECT id AS lists_medication_id, list_id, drug_dosage_instructions FROM lists_medication )",
            "medications ON medications.list_id = id",
            "WHERE pid = ? AND type = ? AND",
            dateEmptySql('enddate')
        ];
    } else {
        $sqlArr = [
            "SELECT * FROM lists WHERE pid = ? AND type = ? AND",
            dateEmptySql('enddate')
        ];
    }


    if ($GLOBALS['erx_enable'] && $GLOBALS['erx_medication_display'] && $type == 'medication') {
        $sqlArr[] = "and erx_uploaded != '1'";
    }

    if ($GLOBALS['erx_enable'] && $GLOBALS['erx_allergy_display'] && $type == 'allergy') {
        $sqlArr[] = "and erx_uploaded != '1'";
    }

    $sqlArr[] = "ORDER BY begdate";

    $sql = implode(" ", $sqlArr);
    $res = sqlStatement($sql, [$pid, $type]);
    $list = [];

    while ($row = sqlFetchArray($res)) {
        if (!$row['enddate'] && !$row['returndate']) {
            $rowclass = "noend_noreturn";
        } elseif (!$row['enddate'] && $row['returndate']) {
            $rowclass = "noend";
        } elseif ($row['enddate'] && !$row['returndate']) {
            $rowclass = "noreturn";
        }

        if ($type == "allergy") {
            $reaction = "";
            if (!empty($row['reaction'])) {
                $reaction = getListItemTitle("reaction", $row['reaction']);
                $row['reactionTitle'] = $reaction;
            }
            if (!empty($row['severity_al'])) {
                $severity = getListItemTitle("severity_ccda", $row['severity_al']);
                // Collapse the SNOMED-CT 272141005 List to 3 groups
                // Not great to hard code this here, this should be abstracted
                // to a better place to handle more comprehensive, centralized class
                // @todo Find a better home for this
                if (in_array($row['severity_al'], ['severe', 'life_threatening_severity', 'fatal'])) {
                    $row['critical'] = true;
                }
                $row['severity'] = $severity;
            }
        }

        $list[] = $row;
    }

    return $list;
}

function getListItemTitle($list, $option)
{
    $row = sqlQuery("SELECT title FROM list_options WHERE " .
        "list_id = ? AND option_id = ? AND activity = 1", array($list, $option));
    if (empty($row['title'])) {
        return $option;
    }

    return xl_list_label($row['title']);
}

function getPreviousNotes()
{
    $sql = "SELECT `id`, `pid`, `message` FROM `form_pnote` WHERE pid = ? ORDER BY `date` DESC LIMIT 1";
    return sqlQuery($sql, [$_SESSION['pid']]);
    
}