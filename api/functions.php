<?php

function createTempArray($sqlStatement)
{

}

function createDateString($date = new DateTime()): string
{
    return $date->format('Y-m-d H:i:s');
}