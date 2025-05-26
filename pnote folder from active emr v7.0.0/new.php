<?php

/*
 * Work/School Note Form new.php
 *
 * @package   OpenEMR
 * @link      http://www.open-emr.org
 * @author    Nikolai Vitsyn
 * @author    Brady Miller <brady.g.miller@gmail.com>
 * @copyright Copyright (c) 2004-2005 Nikolai Vitsyn
 * @copyright Copyright (c) Open Source Medical Software
 * @copyright Copyright (c) 2019 Brady Miller <brady.g.miller@gmail.com>
 * sherwingaddis@gmail.com added bootstrap 2023
 * @license   https://github.com/openemr/openemr/blob/master/LICENSE GNU General Public License 3
 */


require_once dirname(__FILE__, 3) . "/globals.php";
require_once("$srcdir/api.inc");
require_once ("dataCollection.inc.php");

use OpenEMR\Common\Csrf\CsrfUtils;
use OpenEMR\Core\Header;

formHeader("Form: pnote");
$returnurl = 'encounter_top.php';
$provider_results = sqlQuery("select fname, lname from users where username=?", array($_SESSION["authUser"]));
/* name of this form */
$form_name = "pnote";
$previousFormData = getPreviousNotes() ?? "";
$medications = getListData($_SESSION['pid'], 'medication');
$allergies = getListData($_SESSION['pid'], 'allergy');
$surgeries = getListData($_SESSION['pid'], 'surgery');
$medicalProblems = getListData($_SESSION['pid'], 'medical_problem');

//prepare text for the form
$medicalProblemsText = "";
foreach ($medicalProblems as $medicalProblem) {
    $medicalProblemsText .= $medicalProblem['title'] . ", ";
}
$medicalProblemsText = rtrim($medicalProblemsText, ", ");
$mpt = strlen($medicalProblemsText);

if ($mpt == 0) {
    $medicalProblemsText .= 'None Documented';
}
$medicationsText = "";
foreach ($medications as $medication) {
    $medicationsText .= $medication['title'] . ", ";
}
$medicationsText = rtrim($medicationsText, ", ");
$mt = strlen($medicationsText);
if ($mt == 0) {
    $medicationsText .= 'None Documented';
}
$allergiesText = "";
foreach ($allergies as $allergy) {
    $allergiesText .= str_replace("\r\n", ' ', $allergy['title']) . ", ";
}
$allergiesText = rtrim($allergiesText, ", ");
$at = strlen($allergiesText);
if ($at == 0) {
    $allergiesText .= 'None Documented';
}
$surgeryText = "";
foreach ($surgeries as $surgery) {
    $surgeryText .= $surgery['title'] . ", ";
}
$surgeryText = rtrim($surgeryText, ", ");
$st = strlen($surgeryText);
if ($st == 0) {
    $surgeryText .= 'None Documented';
}
?>

<html><head>

<?php Header::setupHeader('datetime-picker'); ?>

<script>
// required for textbox date verification
const mypcc = <?php echo js_escape($GLOBALS['phone_country_code']); ?>;

$(function () {
    $('.datepicker').datetimepicker({
        <?php $datetimepicker_timepicker = true; ?>
        <?php $datetimepicker_showseconds = true; ?>
        <?php $datetimepicker_formatInput = true; ?>
        <?php require($GLOBALS['srcdir'] . '/js/xl/jquery-datetimepicker-2-5-4.js.php'); ?>
        <?php // can add any additional javascript settings to datetimepicker here; need to prepend first setting with a comma ?>
    });
});
</script>

</head>

<body>
<div class="container">
        <div class="row">
        <div class="col-sm-12 mt-5">
            <h1><?php echo xlt('Plastic Surgery Consultation'); ?></h1>
            <?php echo text(date("F d, Y", time())); ?>
        </div>
     <div class="row">
        <div class="col-sm-12">

        <form class="form" method=post action="<?php echo $rootdir . "/forms/" . $form_name . "/save.php?mode=new";?>" name="my_form" id="my_form">
            <input type="hidden" name="csrf_token_form" value="<?php echo attr(CsrfUtils::collectCsrfToken()); ?>" />

            <!--<div style="margin: 10px;">
                <input type="button" class="btn btn-primary save" value="    <?php echo xla('Save'); ?>    "> &nbsp;
                <input type="button" class="btn btn-warning dontsave" value="<?php echo xla('Don\'t Save'); ?>"> &nbsp;
            </div>

            <select class="form-control" name="note_type">
                <option value="WORK NOTE"><?php echo xlt('WORK NOTE'); ?></option>
                <option value="SCHOOL NOTE"><?php echo xlt('SCHOOL NOTE'); ?></option>
            </select>-->
            <br />
            <b><?php echo xlt('Note:'); ?></b>
            <br />
            <textarea class="form-control" name="message" id="message" rows="7" cols="147"><?php echo $previousFormData['message'] ?? '' ?></textarea>
            <br />
            <table class="table">
            <tr>
                <td>
                    <a class="btn btn-primary injectText" href="#" ><?php echo xlt('Medical Issues') ?></a>
                </td>
                <td>
                    <!--<a class="btn btn-primary" href="#" ><?php echo xlt('Medical History') ?></a>-->
                </td>
            </tr>
            </table>
           <!-- <br />
            <b><?php echo xlt('Signature:'); ?></b>
            <br />

            <table class="table">
            <tr><td>
            <?php echo xlt('Doctor:'); ?>
            <input class="form-control" type="text" name="doctor" id="doctor" value="<?php echo attr($provider_results["fname"]) . ' ' . attr($provider_results["lname"]); ?>">
            </td>

            <td>
            <span class="text"><?php echo xlt('Date'); ?></span>
               <input class="datepicker form-control" type='text' size='10' class='datepicker' name='date_of_signature' id='date_of_signature'
                value='<?php echo attr(date('Y-m-d', time())); ?>'
                title='<?php echo xla('yyyy-mm-dd'); ?>' />
            </td>
            </tr>
            </table>-->

            <div style="margin: 10px;">
            <input type="button" class="btn btn-primary save" value="    <?php echo xla('Save'); ?>    "> &nbsp;
            <input type="button" class="btn btn-warning dontsave" value="<?php echo xla('Don\'t Save'); ?>"> &nbsp;
            </div>

        </form>
        </div>
     </div>
</div>
</body>

<script>

// jQuery stuff to make the page a little easier to use

$(function () {
    $(".save").click(function() { top.restoreSession(); $('#my_form').submit(); });
    $(".dontsave").click(function() { parent.closeTab(window.name, false); });
});

$(function () {
    $(".injectText").click(function() { injectTextAtCursor(); });
});
function injectTextAtCursor() {
    const text = "<?php echo "MEDICAL HISTORY: " . strtoupper($medicalProblemsText); ?>";
    const text2 = "<?php echo "SURGERIES: " . $surgeryText; ?>";
    const text3 = "<?php echo "MEDICATIONS: " . $medicationsText; ?>";
    const text4 = "<?php echo "Allergies: " . $allergiesText; ?>";
    const inputElement = document.getElementById('message');

    if (inputElement.selectionStart || inputElement.selectionStart === 0) {
        const startPos = inputElement.selectionStart;
        const endPos = inputElement.selectionEnd;
        const inputValue = inputElement.value;

        inputElement.value = inputValue.substring(0, startPos) + text + "\r" + text2 + "\r" + text3 + "\r" + text4 + inputValue.substring(endPos);
        inputElement.selectionStart = startPos + text.length;
        inputElement.selectionEnd = startPos + text.length;
    } else {
        inputElement.value += text;
    }
}
</script>

</html>
